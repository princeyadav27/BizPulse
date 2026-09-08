import { useState, useEffect } from 'react'
import Styles from '../styles/FuelSales.module.css'

const FuelSales = () => {
    const [userBusiness, setUserBusiness] = useState('');
    const [salesData, setSalesData] = useState([]);
    const [timeRange, setTimeRange] = useState('today'); // 'today', 'week', 'month'
    const [selectedFuel, setSelectedFuel] = useState('all');

    useEffect(() => {
        // Get user data
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserBusiness(parsedData.businessType);
        }

        // Get sales data - filter by current user
        const salesRecords = localStorage.getItem('salesData');
        const allSales = salesRecords ? JSON.parse(salesRecords) : [];
        
        // Get current user ID
        const userId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : null;
        const sales = userId ? allSales.filter(sale => sale.userId === userId) : allSales;
        
        setSalesData(sales);
    }, []);

    const getFilteredData = () => {
        const now = new Date();
        let startDate = new Date();
        
        switch(timeRange) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(now.getDate() - 30);
                break;
            default:
                startDate.setHours(0, 0, 0, 0);
        }

        return salesData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        });
    };

    const filteredData = getFilteredData();

    const getFuelStats = (fuelType) => {
        const fuelData = filteredData.filter(item => {
            if (fuelType === 'all') return true;
            return item.petrolSales && fuelType === 'petrol' ||
                   item.dieselSales && fuelType === 'diesel' ||
                   item.cngSales && fuelType === 'cng';
        });

        return fuelData.reduce((acc, item) => {
            if (fuelType === 'petrol' || fuelType === 'all') {
                acc.sales += parseFloat(item.petrolSales) || 0;
                acc.liters += parseFloat(item.petrolLiters) || 0;
            }
            if (fuelType === 'diesel' || fuelType === 'all') {
                acc.sales += parseFloat(item.dieselSales) || 0;
                acc.liters += parseFloat(item.dieselLiters) || 0;
            }
            if (fuelType === 'cng' || fuelType === 'all') {
                acc.sales += parseFloat(item.cngSales) || 0;
                acc.liters += parseFloat(item.cngLiters) || 0;
            }
            // Only count transactions for the specific fuel type
            if (fuelType !== 'all') {
                acc.transactions++;
            }
            return acc;
        }, { sales: 0, liters: 0, transactions: 0 });
    };

    const petrolStats = getFuelStats('petrol');
    const dieselStats = getFuelStats('diesel');
    const cngStats = getFuelStats('cng');
    const allStats = getFuelStats('all');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getDisplayData = () => {
        switch(selectedFuel) {
            case 'petrol':
                return [petrolStats];
            case 'diesel':
                return [dieselStats];
            case 'cng':
                return [cngStats];
            default:
                return [
                    { ...petrolStats, fuelType: 'Petrol' },
                    { ...dieselStats, fuelType: 'Diesel' },
                    { ...cngStats, fuelType: 'CNG' }
                ];
        }
    };

    const getTableData = () => {
        const tableRows = [];
        
        filteredData.forEach(item => {
            // Add petrol row if exists
            if (item.petrolSales && parseFloat(item.petrolSales) > 0) {
                tableRows.push({
                    date: item.date,
                    fuelType: 'Petrol',
                    fuelIcon: '',
                    liters: parseFloat(item.petrolLiters) || 0,
                    amount: parseFloat(item.petrolSales) || 0,
                    pricePerLiter: parseFloat(item.petrolLiters) > 0 ? 
                        parseFloat(item.petrolSales) / parseFloat(item.petrolLiters) : 0
                });
            }
            
            // Add diesel row if exists
            if (item.dieselSales && parseFloat(item.dieselSales) > 0) {
                tableRows.push({
                    date: item.date,
                    fuelType: 'Diesel',
                    fuelIcon: '',
                    liters: parseFloat(item.dieselLiters) || 0,
                    amount: parseFloat(item.dieselSales) || 0,
                    pricePerLiter: parseFloat(item.dieselLiters) > 0 ? 
                        parseFloat(item.dieselSales) / parseFloat(item.dieselLiters) : 0
                });
            }
            
            // Add CNG row if exists
            if (item.cngSales && parseFloat(item.cngSales) > 0) {
                tableRows.push({
                    date: item.date,
                    fuelType: 'CNG',
                    fuelIcon: '',
                    liters: parseFloat(item.cngLiters) || 0,
                    amount: parseFloat(item.cngSales) || 0,
                    pricePerLiter: parseFloat(item.cngLiters) > 0 ? 
                        parseFloat(item.cngSales) / parseFloat(item.cngLiters) : 0
                });
            }
            
            // Add other sales row if exists
            if (item.otherSales && parseFloat(item.otherSales) > 0) {
                tableRows.push({
                    date: item.date,
                    fuelType: 'Other',
                    fuelIcon: '',
                    liters: 0,
                    amount: parseFloat(item.otherSales) || 0,
                    pricePerLiter: 0
                });
            }
        });
        
        return tableRows;
    };

    const displayData = getDisplayData();
    const tableData = getTableData();

    return (
        <div className={Styles.fuelSales}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>Fuel Sales</h1>
                    <div className={Styles.controls}>
                        <div className={Styles.timeRangeSelector}>
                            <label>Time Range:</label>
                            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </select>
                        </div>
                        <div className={Styles.fuelSelector}>
                            <label>Fuel Type:</label>
                            <select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)}>
                                <option value="all">All Fuels</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="cng">CNG</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className={Styles.summaryGrid}>
                    {displayData.map((stats, index) => (
                        <div key={index} className={Styles.summaryCard}>
                            <div className={Styles.cardIcon}>
                                {stats.fuelType === 'Petrol' ? '' : 
                                 stats.fuelType === 'Diesel' ? '' : ''}
                            </div>
                            <div className={Styles.cardContent}>
                                <h3>{stats.fuelType} Sales</h3>
                                <div className={Styles.statsGrid}>
                                    <div className={Styles.statItem}>
                                        <span className={Styles.statLabel}>Total Revenue</span>
                                        <span className={Styles.statValue}>{formatCurrency(stats.sales)}</span>
                                    </div>
                                    <div className={Styles.statItem}>
                                        <span className={Styles.statLabel}>Total Liters</span>
                                        <span className={Styles.statValue}>{stats.liters.toFixed(0)}L</span>
                                    </div>
                                    <div className={Styles.statItem}>
                                        <span className={Styles.statLabel}>Transactions</span>
                                        <span className={Styles.statValue}>{stats.transactions}</span>
                                    </div>
                                    <div className={Styles.statItem}>
                                        <span className={Styles.statLabel}>Avg per Transaction</span>
                                        <span className={Styles.statValue}>
                                            {stats.transactions > 0 ? formatCurrency(stats.sales / stats.transactions) : '₹0'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sales Table */}
                <div className={Styles.tableSection}>
                    <h2>Sales Transactions</h2>
                    <div className={Styles.tableContainer}>
                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Fuel Type</th>
                                    <th>Liters</th>
                                    <th>Amount</th>
                                    <th>Price/Liter</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.date}</td>
                                        <td>
                                            <span className={Styles.fuelBadge}>
                                                {row.fuelIcon} {row.fuelType}
                                            </span>
                                        </td>
                                        <td>
                                            {row.liters > 0 ? `${row.liters.toFixed(1)}L` : 'N/A'}
                                        </td>
                                        <td className={Styles.amount}>
                                            {formatCurrency(row.amount)}
                                        </td>
                                        <td>
                                            {row.pricePerLiter > 0 ? formatCurrency(row.pricePerLiter) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className={Styles.metricsSection}>
                    <h2>Performance Metrics</h2>
                    <div className={Styles.metricsGrid}>
                        <div className={Styles.metricCard}>
                            <h4>Total Sales Volume</h4>
                            <p>{allStats.liters.toFixed(0)} Liters</p>
                            <small>All fuel types</small>
                        </div>
                        <div className={Styles.metricCard}>
                            <h4>Total Revenue</h4>
                            <p>{formatCurrency(allStats.sales)}</p>
                            <small>All fuel types</small>
                        </div>
                        <div className={Styles.metricCard}>
                            <h4>Average Price/Liter</h4>
                            <p>
                                {allStats.liters > 0 ? 
                                    formatCurrency(allStats.sales / allStats.liters) : 
                                    'N/A'
                                }
                            </p>
                            <small>Weighted average</small>
                        </div>
                        <div className={Styles.metricCard}>
                            <h4>Best Performing Fuel</h4>
                            <p>
                                {petrolStats.sales >= dieselStats.sales && petrolStats.sales >= cngStats.sales ? 'Petrol' :
                                 dieselStats.sales >= cngStats.sales ? 'Diesel' : 'CNG'}
                            </p>
                            <small>By revenue</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuelSales;
