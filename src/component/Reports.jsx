import { useState, useEffect } from 'react'
import Styles from '../styles/Reports.module.css'

const Reports = () => {
    const [salesData, setSalesData] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [menuData, setMenuData] = useState([]);
    const [purchaseData, setPurchaseData] = useState([]);
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState('month');
    const [userBusiness, setUserBusiness] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        loadData();
        getBusinessType();
    }, []);

    useEffect(() => {
        // Listen for business type changes
        const handleStorageChange = () => {
            console.log('Reports - Storage changed, checking business type');
            getBusinessType();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Recalculate reports when dropdown values change
    useEffect(() => {
        console.log('Reports - useEffect triggered by:', { reportType, dateRange, userBusiness });
        if (userBusiness) {
            loadData();
        }
    }, [reportType, dateRange, userBusiness]);

    const getBusinessType = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            const newBusinessType = parsedData.businessType;
            
            console.log('Reports - getBusinessType called:', newBusinessType);
            
            // Only update if business type actually changed
            if (newBusinessType !== userBusiness) {
                setUserBusiness(newBusinessType);
                setUserId(parsedData.id || parsedData.userId);
                
                // Set default report type based on business (only if business changed)
                switch(newBusinessType) {
                    case 'petrol-pump':
                        setReportType('fuel-sales');
                        break;
                    case 'restaurant':
                        setReportType('orders');
                        break;
                    case 'retail':
                        setReportType('sales');
                        break;
                    case 'service':
                        setReportType('services');
                        break;
                    default:
                        setReportType('sales');
                }
            }
        }
    };

    const loadData = () => {
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const parsedUserData = JSON.parse(userData);
        const currentUserId = parsedUserData.id || parsedUserData.userId;
        
        console.log('Reports - Loading Data:');
        console.log('  - User Business:', userBusiness);
        console.log('  - User ID:', currentUserId);
        console.log('  - Report Type:', reportType);
        console.log('  - Date Range:', dateRange);
        
        // Load data based on business type
        switch(userBusiness) {
            case 'petrol-pump':
                const petrolSales = JSON.parse(localStorage.getItem('salesData') || '[]').filter(item => item.userId === currentUserId);
                const petrolStock = JSON.parse(localStorage.getItem('stockData') || '[]').filter(item => item.userId === currentUserId);
                const petrolTransactions = JSON.parse(localStorage.getItem('stockTransactions') || '[]').filter(item => item.userId === currentUserId);
                
                console.log('  - Petrol Sales:', petrolSales.length);
                console.log('  - Petrol Stock:', petrolStock.length);
                console.log('  - Petrol Transactions:', petrolTransactions.length);
                
                setSalesData(petrolSales);
                setStockData(petrolStock);
                setOrdersData(petrolTransactions);
                break;
                
            case 'restaurant':
                const restaurantSales = JSON.parse(localStorage.getItem('salesData') || '[]').filter(item => item.userId === currentUserId);
                const restaurantStock = JSON.parse(localStorage.getItem('restaurantStock') || '[]').filter(item => item.userId === currentUserId);
                const restaurantOrders = JSON.parse(localStorage.getItem('restaurantOrders') || '[]').filter(item => item.userId === currentUserId);
                const restaurantMenu = JSON.parse(localStorage.getItem('restaurantMenu') || '[]').filter(item => item.userId === currentUserId);
                const restaurantPurchases = JSON.parse(localStorage.getItem('restaurantPurchases') || '[]').filter(item => item.userId === currentUserId);
                
                console.log('  - Restaurant Sales:', restaurantSales.length);
                console.log('  - Restaurant Stock:', restaurantStock.length);
                console.log('  - Restaurant Orders:', restaurantOrders.length);
                console.log('  - Restaurant Menu:', restaurantMenu.length);
                console.log('  - Restaurant Purchases:', restaurantPurchases.length);
                
                setSalesData(restaurantSales);
                setStockData(restaurantStock);
                setOrdersData(restaurantOrders);
                setMenuData(restaurantMenu);
                setPurchaseData(restaurantPurchases);
                break;
                
            case 'retail':
                const retailSales = JSON.parse(localStorage.getItem('salesData') || '[]').filter(item => item.userId === currentUserId);
                const retailStock = JSON.parse(localStorage.getItem('stockData') || '[]').filter(item => item.userId === currentUserId);
                const retailProducts = JSON.parse(localStorage.getItem('retailProducts') || '[]').filter(item => item.userId === currentUserId);
                
                console.log('  - Retail Sales:', retailSales.length);
                console.log('  - Retail Stock:', retailStock.length);
                console.log('  - Retail Products:', retailProducts.length);
                
                setSalesData(retailSales);
                setStockData(retailStock);
                setMenuData(retailProducts);
                break;
                
            case 'service':
                const serviceSales = JSON.parse(localStorage.getItem('salesData') || '[]').filter(item => item.userId === currentUserId);
                const serviceBookings = JSON.parse(localStorage.getItem('serviceBookings') || '[]').filter(item => item.userId === currentUserId);
                const serviceStaff = JSON.parse(localStorage.getItem('serviceStaff') || '[]').filter(item => item.userId === currentUserId);
                
                console.log('  - Service Sales:', serviceSales.length);
                console.log('  - Service Bookings:', serviceBookings.length);
                console.log('  - Service Staff:', serviceStaff.length);
                
                setSalesData(serviceSales);
                setOrdersData(serviceBookings);
                setMenuData(serviceStaff);
                break;
                
            default:
                const defaultSales = JSON.parse(localStorage.getItem('salesData') || '[]').filter(item => item.userId === currentUserId);
                const defaultStock = JSON.parse(localStorage.getItem('stockData') || '[]').filter(item => item.userId === currentUserId);
                
                console.log('  - Default Sales:', defaultSales.length);
                console.log('  - Default Stock:', defaultStock.length);
                
                setSalesData(defaultSales);
                setStockData(defaultStock);
        }
    };

    const getSalesReport = () => {
        const now = new Date();
        let startDate = new Date();
        
        if (dateRange === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (dateRange === 'month') {
            startDate.setDate(now.getDate() - 30);
        } else {
            startDate.setDate(now.getDate() - 365);
        }

        console.log('Reports - Calculating Sales Report:');
        console.log('  - Date Range:', dateRange);
        console.log('  - Start Date:', startDate.toISOString().split('T')[0]);
        console.log('  - Sales Data Length:', salesData.length);
        console.log('  - Orders Data Length:', ordersData.length);

        let total = 0;
        let totalOrders = 0;
        let todayOrders = 0;
        let filteredSales = [];

        // Business-specific calculations
        if (userBusiness === 'restaurant') {
            // For restaurant, calculate from orders data
            filteredSales = ordersData.filter(order => {
                const orderDate = new Date(order.createdAt || order.date);
                return orderDate >= startDate;
            });
            
            total = filteredSales.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
            totalOrders = filteredSales.length;
            
            // Today's orders
            todayOrders = filteredSales.filter(order => {
                const orderDate = new Date(order.createdAt || order.date);
                return orderDate.toISOString().split('T')[0] === now.toISOString().split('T')[0];
            }).length;
            
            console.log('  - Restaurant Orders:', filteredSales.length);
            console.log('  - Restaurant Total Revenue:', total);
        } else {
            // For other businesses, use sales data
            filteredSales = salesData.filter(sale => new Date(sale.date) >= startDate);
            total = filteredSales.reduce((sum, sale) => sum + (parseFloat(sale.totalSales) || 0), 0);
            totalOrders = filteredSales.length;
            
            // For petrol pump, today's orders are today's sales
            if (userBusiness === 'petrol-pump') {
                todayOrders = filteredSales.filter(sale => 
                    new Date(sale.date || sale.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                ).length;
            } else {
                // For other businesses, use orders data
                todayOrders = ordersData.filter(order => 
                    new Date(order.createdAt || order.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                ).length;
            }
        }

        const avgOrderValue = totalOrders > 0 ? total / totalOrders : 0;

        console.log('  - Total Revenue:', total);
        console.log('  - Total Orders:', totalOrders);
        console.log('  - Average Order Value:', avgOrderValue);
        console.log('  - Today Orders:', todayOrders);

        return { total, totalOrders, avgOrderValue, todayOrders, count: filteredSales.length };
    };

    const getStockReport = () => {
        const now = new Date();
        let startDate = new Date();
        
        if (dateRange === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (dateRange === 'month') {
            startDate.setDate(now.getDate() - 30);
        } else {
            startDate.setDate(now.getDate() - 365);
        }

        const filteredPurchases = purchaseData.filter(p => new Date(p.date) >= startDate);
        
        // Calculate usage from orders/sales
        const usageData = {};
        ordersData.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    if (usageData[item.name]) {
                        usageData[item.name] += item.quantity || 1;
                    } else {
                        usageData[item.name] = item.quantity || 1;
                    }
                });
            }
        });

        return stockData.map(stock => {
            const totalPurchased = filteredPurchases
                .filter(p => p.itemName === stock.name)
                .reduce((sum, p) => sum + p.quantity, 0);

            const usage = usageData[stock.name] || 0;
            const daysInPeriod = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
            const avgDailyUsage = daysInPeriod > 0 ? usage / daysInPeriod : 0;
            const daysUntilEmpty = avgDailyUsage > 0 ? Math.floor(stock.currentStock / avgDailyUsage) : 999;
            
            return {
                item: stock.name,
                category: stock.category,
                current: stock.currentStock,
                minLevel: stock.minLevel,
                unit: stock.unit,
                totalPurchased,
                usage,
                avgDailyUsage: avgDailyUsage.toFixed(2),
                daysUntilEmpty,
                value: stock.currentStock * 50,
                status: stock.currentStock <= stock.minLevel ? 'Low Stock' : 'In Stock'
            };
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const salesReport = getSalesReport();
    const stockReport = getStockReport();

    return (
        <div className={Styles.reports}>
            <div className={Styles.header}>
                <h1>Business Reports</h1>
                <p>{userBusiness?.replace('-', ' ').toUpperCase() || 'BUSINESS'} Management</p>
                
                <div className={Styles.controls}>
                    <div className={Styles.reportTypeSelector}>
                        <select 
                            value={reportType} 
                            onChange={(e) => {
                                console.log('Reports - Report Type Changed:', e.target.value);
                                setReportType(e.target.value);
                            }}
                            className={Styles.dropdown}
                        >
                            {userBusiness === 'petrol-pump' && (
                                <>
                                    <option value="fuel-sales">Fuel Sales</option>
                                    <option value="stock">Stock Report</option>
                                    <option value="transactions">Transactions</option>
                                </>
                            )}
                            
                            {userBusiness === 'restaurant' && (
                                <>
                                    <option value="orders">Orders</option>
                                    <option value="menu">Menu Performance</option>
                                    <option value="stock">Kitchen Stock</option>
                                    <option value="sales">Sales</option>
                                </>
                            )}
                            
                            {userBusiness === 'retail' && (
                                <>
                                    <option value="sales">Sales</option>
                                    <option value="stock">Inventory</option>
                                    <option value="products">Products</option>
                                </>
                            )}
                            
                            {userBusiness === 'service' && (
                                <>
                                    <option value="services">Services</option>
                                    <option value="bookings">Bookings</option>
                                    <option value="staff">Staff Performance</option>
                                </>
                            )}
                        </select>
                    </div>
                    
                    <div className={Styles.dateRangeSelector}>
                        <select 
                            value={dateRange} 
                            onChange={(e) => {
                                console.log('Reports - Date Range Changed:', e.target.value);
                                setDateRange(e.target.value);
                            }}
                            className={Styles.dropdown}
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={Styles.content}>
                {/* Sales Report */}
                {(reportType === 'sales' || reportType === 'fuel-sales') && (
                    <div className={Styles.reportSection}>
                        <h2>Sales Report</h2>
                        <div className={Styles.summaryCards}>
                            <div className={Styles.card}>
                                <h3>Total Revenue</h3>
                                <p className={Styles.value}>{formatCurrency(salesReport.total)}</p>
                                <span>In selected period</span>
                            </div>
                            <div className={Styles.card}>
                                <h3>Total Orders</h3>
                                <p className={Styles.value}>{salesReport.totalOrders}</p>
                                <span>Completed transactions</span>
                            </div>
                            <div className={Styles.card}>
                                <h3>Average Order Value</h3>
                                <p className={Styles.value}>{formatCurrency(salesReport.avgOrderValue)}</p>
                                <span>Per transaction</span>
                            </div>
                            <div className={Styles.card}>
                                <h3>Today's Orders</h3>
                                <p className={Styles.value}>{salesReport.todayOrders}</p>
                                <span>So far today</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock Report */}
                {reportType === 'stock' && (
                    <div className={Styles.reportSection}>
                        <h2>Stock Report</h2>
                        <div className={Styles.tableContainer}>
                            <table className={Styles.reportTable}>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Category</th>
                                        <th>Current Stock</th>
                                        <th>Min Level</th>
                                        <th>Unit</th>
                                        <th>Value</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockReport.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.item}</td>
                                            <td>{item.category}</td>
                                            <td>{item.current}</td>
                                            <td>{item.minLevel}</td>
                                            <td>{item.unit}</td>
                                            <td>{formatCurrency(item.value)}</td>
                                            <td>
                                                <span className={`${Styles.status} ${item.status === 'Low Stock' ? Styles.low : Styles.good}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders Report (Restaurant) */}
                {reportType === 'orders' && userBusiness === 'restaurant' && (
                    <div className={Styles.reportSection}>
                        <h2>Orders Report</h2>
                        <div className={Styles.summaryCards}>
                            <div className={Styles.card}>
                                <h3>Total Orders</h3>
                                <p className={Styles.value}>{ordersData.length}</p>
                                <span>All time</span>
                            </div>
                            <div className={Styles.card}>
                                <h3>Today's Orders</h3>
                                <p className={Styles.value}>{salesReport.todayOrders}</p>
                                <span>So far today</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Report (Petrol Pump) */}
                {reportType === 'transactions' && userBusiness === 'petrol-pump' && (
                    <div className={Styles.reportSection}>
                        <h2>Transactions Report</h2>
                        <div className={Styles.summaryCards}>
                            <div className={Styles.card}>
                                <h3>Total Transactions</h3>
                                <p className={Styles.value}>{ordersData.length}</p>
                                <span>All transactions</span>
                            </div>
                            <div className={Styles.card}>
                                <h3>Fuel Sales</h3>
                                <p className={Styles.value}>{formatCurrency(salesReport.total)}</p>
                                <span>Total revenue</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Placeholder for other report types */}
                {(reportType === 'menu' || reportType === 'products' || reportType === 'services' || 
                  reportType === 'bookings' || reportType === 'staff') && (
                    <div className={Styles.reportSection}>
                        <h2>{reportType.charAt(0).toUpperCase() + reportType.slice(1).replace('-', ' ')} Report</h2>
                        <div className={Styles.placeholder}>
                            <p>Detailed {reportType} reports coming soon...</p>
                            <p>This will show comprehensive analytics for {reportType}.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
