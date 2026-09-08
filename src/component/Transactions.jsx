import { useState, useEffect } from 'react'
import Styles from '../styles/Transactions.module.css'
import { PiCurrencyInr, PiPackage, PiReceipt } from 'react-icons/pi'

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'sales', 'stock'
    const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [userBusiness, setUserBusiness] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserBusiness(parsedData.businessType);
            setUserId(parsedData.id || parsedData.userId);
        }
    }, []);

    useEffect(() => {
        loadTransactions();
    }, [filter, dateFilter, userBusiness, userId]);

    const loadTransactions = () => {
        const userData = localStorage.getItem('userData');
        const currentUserId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : '';

        // Load sales data - filter by user
        const sales = JSON.parse(localStorage.getItem('salesData') || '[]').filter(s => !s.userId || s.userId === currentUserId);
        const stockTrans = JSON.parse(localStorage.getItem('stockTransactions') || '[]').filter(s => !s.userId || s.userId === currentUserId);

        // Convert sales to transactions
        const salesTransactions = sales.map(sale => {
            let categoryText = 'Fuel Sales';
            let detailsText = `Petrol: ₹${sale.petrolSales || 0}, Diesel: ₹${sale.dieselSales || 0}, CNG: ₹${sale.cngSales || 0}`;
            
            if (userBusiness === 'restaurant') {
                categoryText = 'Food Orders';
                detailsText = `Orders recorded. Total amount: ₹${sale.totalSales || 0}`;
            } else if (userBusiness === 'retail') {
                categoryText = 'Product Sales';
                detailsText = `Product transaction. Total amount: ₹${sale.totalSales || 0}`;
            } else if (userBusiness === 'service') {
                categoryText = 'Service Jobs';
                detailsText = `Services billed. Total amount: ₹${sale.totalSales || 0}`;
            }
            
            return {
                id: sale.id,
                date: sale.date,
                time: new Date(sale.timestamp || sale.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                type: 'Sales',
                category: categoryText,
                amount: parseFloat(sale.totalSales || 0),
                details: detailsText,
                timestamp: new Date(sale.timestamp || sale.date).getTime()
            };
        });

        // Convert stock transactions
        const stockTransactions = stockTrans.map(trans => {
            const unitText = (userBusiness === 'retail' || userBusiness === 'service' || userBusiness === 'restaurant') ? ' Units' : 'L';
            return {
                id: trans.id,
                date: trans.date,
                time: trans.time,
                type: 'Stock',
                category: trans.action === 'add' ? 'Purchase' : 'Adjustment',
                amount: trans.quantity,
                unit: unitText,
                details: `${trans.fuelType} - ${trans.supplier}`,
                timestamp: trans.id
            };
        });

        // Combine and filter
        let combined = [...salesTransactions, ...stockTransactions];

        // Apply type filter
        if (filter === 'sales') {
            combined = combined.filter(t => t.type === 'Sales');
        } else if (filter === 'stock') {
            combined = combined.filter(t => t.type === 'Stock');
        }

        // Apply date filter
        const now = new Date();
        if (dateFilter === 'today') {
            const today = now.toISOString().split('T')[0];
            combined = combined.filter(t => t.date === today);
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            combined = combined.filter(t => new Date(t.date) >= weekAgo);
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            combined = combined.filter(t => new Date(t.date) >= monthAgo);
        }

        // Sort by timestamp (latest first)
        combined.sort((a, b) => b.timestamp - a.timestamp);

        setTransactions(combined);
    };

    const getTotalAmount = () => {
        return transactions
            .filter(t => t.type === 'Sales')
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const getTotalStock = () => {
        return transactions
            .filter(t => t.type === 'Stock' && t.category === 'Purchase')
            .reduce((sum, t) => sum + t.amount, 0);
    };

    return (
        <div className={Styles.transactions}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>All Transactions</h1>
                    <p>Complete transaction history of sales and stock management</p>
                </div>

                {/* Summary Cards */}
                <div className={Styles.summaryGrid}>
                    <div className={Styles.summaryCard}>
                        <div className={Styles.cardIcon}><PiCurrencyInr aria-hidden="true" /></div>
                        <div className={Styles.cardContent}>
                            <h3>Total Sales</h3>
                            <p className={Styles.cardValue}>₹{getTotalAmount().toFixed(2)}</p>
                            <span className={Styles.cardLabel}>In selected period</span>
                        </div>
                    </div>
                    <div className={Styles.summaryCard}>
                        <div className={Styles.cardIcon}><PiPackage aria-hidden="true" /></div>
                        <div className={Styles.cardContent}>
                            <h3>Stock Purchased</h3>
                            <p className={Styles.cardValue}>
                                {getTotalStock().toFixed(0)} {userBusiness === 'retail' || userBusiness === 'service' || userBusiness === 'restaurant' ? 'Units' : 'L'}
                            </p>
                            <span className={Styles.cardLabel}>Total quantity</span>
                        </div>
                    </div>
                    <div className={Styles.summaryCard}>
                        <div className={Styles.cardIcon}><PiReceipt aria-hidden="true" /></div>
                        <div className={Styles.cardContent}>
                            <h3>Total Transactions</h3>
                            <p className={Styles.cardValue}>{transactions.length}</p>
                            <span className={Styles.cardLabel}>All activities</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className={Styles.filters}>
                    <div className={Styles.filterGroup}>
                        <label>Type:</label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Transactions</option>
                            <option value="sales">Sales Only</option>
                            <option value="stock">Stock Only</option>
                        </select>
                    </div>
                    <div className={Styles.filterGroup}>
                        <label>Period:</label>
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className={Styles.tableSection}>
                    <div className={Styles.tableContainer}>
                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map(trans => (
                                        <tr key={trans.id}>
                                            <td>{trans.date}</td>
                                            <td>{trans.time}</td>
                                            <td>
                                                <span className={`${Styles.typeBadge} ${Styles[trans.type.toLowerCase()]}`}>
                                                    {trans.type}
                                                </span>
                                            </td>
                                            <td>{trans.category}</td>
                                            <td className={Styles.amount}>
                                                {trans.type === 'Sales' ? `₹${trans.amount.toFixed(2)}` : `${trans.amount}${trans.unit || 'L'}`}
                                            </td>
                                            <td className={Styles.details}>{trans.details}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className={Styles.noData}>
                                            No transactions found for selected filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
