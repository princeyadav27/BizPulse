import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/RestaurantDashboard.module.css'
import ThoughtsStyles from '../styles/BusinessThoughts.module.css'
import BusinessThoughts from './BusinessThoughts'
import BusinessNews from './BusinessNews'
import { PiArmchair, PiChartLine, PiClipboardText, PiCreditCard, PiCurrencyInr, PiForkKnife, PiPackage, PiWarning } from 'react-icons/pi'

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    const [userBusiness, setUserBusiness] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [dashboardData, setDashboardData] = useState({
        todaySales: 0,
        totalOrders: 0,
        availableTables: 0,
        lowStockAlerts: 0,
        dailyProfit: 0,
        dailyExpense: 0
    });

    useEffect(() => {
        // Get user data
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserBusiness(parsedData.businessType);
            
            // Debug logging
            console.log('Restaurant Dashboard - Business Type:', parsedData.businessType);
            console.log('Restaurant Dashboard - Business Name:', parsedData.businessName);
            console.log('Restaurant Dashboard - Restaurant Name:', parsedData.restaurantName);
            
            // Set business name with proper fallbacks
            let businessName = parsedData.businessName;
            if (!businessName) {
                businessName = parsedData.restaurantName || 'My Restaurant';
            }
            
            console.log('Restaurant Dashboard - Final Business Name:', businessName);
            setRestaurantName(businessName);
            setCurrentUserId(parsedData.id || parsedData.userId);
        }

        // Load dashboard data
        loadDashboardData();
    }, []);

    const loadDashboardData = () => {
        // Get current user data
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id || parsedUserData.userId;

        console.log('Restaurant Dashboard - Loading data for userId:', userId);

        // Get today's orders data - filter by current user
        const orders = localStorage.getItem('restaurantOrders');
        const allOrderData = orders ? JSON.parse(orders) : [];
        const orderData = allOrderData.filter(order => order.userId === userId);
        
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orderData.filter(order => 
            new Date(order.createdAt).toISOString().split('T')[0] === today
        );
        
        console.log('Restaurant Dashboard - Today Orders:', todayOrders.length);
        console.log('Restaurant Dashboard - All Orders:', orderData.length);
        
        // Calculate today's total sales from orders
        const totalSales = todayOrders.reduce((sum, order) => {
            return sum + (parseFloat(order.totalAmount) || 0);
        }, 0);
        
        console.log('Restaurant Dashboard - Today Sales Total:', totalSales);

        // Get available tables
        const tables = localStorage.getItem('restaurantTables');
        const tableData = tables ? JSON.parse(tables) : [];
        const availableTables = tableData.filter(table => table.status === 'available').length;
        
        // Get low stock alerts - filter by current user
        const stock = localStorage.getItem('restaurantStock');
        const allStockData = stock ? JSON.parse(stock) : [];
        const stockData = allStockData.filter(item => item.userId === userId);
        const lowStockAlerts = stockData.filter(item => item.currentStock <= item.minStock).length;
        
        // Calculate profit/expense (simulated)
        const dailyExpense = totalSales * 0.4; // 40% expense
        const dailyProfit = totalSales - dailyExpense;

        console.log('Restaurant Dashboard - Setting dashboard data:', {
            todaySales: totalSales,
            totalOrders: todayOrders.length || orderData.length,
            availableTables,
            lowStockAlerts,
            dailyProfit,
            dailyExpense
        });

        setDashboardData({
            todaySales: totalSales,
            totalOrders: todayOrders.length || orderData.length,
            availableTables,
            lowStockAlerts,
            dailyProfit,
            dailyExpense
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className={Styles.restaurantDashboard}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <div>
                        <h1>{restaurantName}</h1>
                        <p className={Styles.subtitle}>Restaurant Dashboard</p>
                    </div>
                    <div className={Styles.businessBadge}>
                        Business Type: <span>Restaurant</span>
                    </div>
                </div>

                {/* Main KPI Cards - Only 5 Features */}
                <div className={Styles.kpiGrid}>
                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiCurrencyInr aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Today Total Sales</h3>
                            <p>{formatCurrency(dashboardData.todaySales)}</p>
                            <span className={Styles.kpiChange}>Today's Revenue</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiForkKnife aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Total Orders</h3>
                            <p>{dashboardData.totalOrders}</p>
                            <span className={Styles.kpiChange}>Today's Orders</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiArmchair aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Available Tables</h3>
                            <p>{dashboardData.availableTables}</p>
                            <span className={Styles.kpiChange}>Ready for Service</span>
                        </div>
                    </div>

                    <div className={`${Styles.kpiCard} ${dashboardData.lowStockAlerts > 0 ? Styles.alert : ''}`}>
                        <div className={Styles.kpiIcon}><PiWarning aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Low Stock Alert</h3>
                            <p>{dashboardData.lowStockAlerts}</p>
                            <span className={Styles.kpiChange}>
                                {dashboardData.lowStockAlerts > 0 ? 'Items Need Restock' : 'All Stock OK'}
                            </span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiChartLine aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Daily Profit / Expense Summary</h3>
                            <div className={Styles.profitExpense}>
                                <div className={Styles.profit}>
                                    <span>Profit:</span>
                                    <span>{formatCurrency(dashboardData.dailyProfit)}</span>
                                </div>
                                <div className={Styles.expense}>
                                    <span>Expense:</span>
                                    <span>{formatCurrency(dashboardData.dailyExpense)}</span>
                                </div>
                            </div>
                            <span className={Styles.kpiChange}>Net: {formatCurrency(dashboardData.dailyProfit)}</span>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className={Styles.summarySection}>
                    <h2>Today's Summary</h2>
                    <div className={Styles.summaryGrid}>
                        <div className={Styles.summaryCard}>
                            <h4>Revenue Performance</h4>
                            <div className={Styles.performance}>
                                <div className={Styles.progressBar}>
                                    <div className={Styles.progress} style={{ width: '75%' }}></div>
                                </div>
                                <span>75% of daily target</span>
                            </div>
                        </div>
                        
                        <div className={Styles.summaryCard}>
                            <h4>Table Occupancy</h4>
                            <div className={Styles.performance}>
                                <div className={Styles.progressBar}>
                                    <div className={Styles.progress} style={{ width: '60%' }}></div>
                                </div>
                                <span>60% tables occupied</span>
                            </div>
                        </div>
                        
                        <div className={Styles.summaryCard}>
                            <h4>Stock Status</h4>
                            <div className={Styles.performance}>
                                <div className={Styles.progressBar}>
                                    <div className={`${Styles.progress} ${dashboardData.lowStockAlerts > 0 ? Styles.warning : ''}`} 
                                         style={{ width: dashboardData.lowStockAlerts > 0 ? '20%' : '90%' }}></div>
                                </div>
                                <span>{dashboardData.lowStockAlerts > 0 ? 'Low Stock Alert' : 'Stock Levels Good'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feed Grid wrapping Business Thoughts & News */}
                <div className={ThoughtsStyles.feedGrid}>
                    <BusinessThoughts businessType={userBusiness || 'restaurant'} />
                    <BusinessNews businessType={userBusiness || 'restaurant'} />
                </div>

                {/* Quick Actions */}
                <div className={Styles.quickActions}>
                    <h2>Quick Actions</h2>
                    <div className={Styles.actionsGrid}>
                        <button className={Styles.actionBtn} onClick={() => navigate('/restaurant-orders')}>
                            <span className={Styles.btnIcon}><PiForkKnife aria-hidden="true" /></span>
                            <span>New Order</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/restaurant-billing')}>
                            <span className={Styles.btnIcon}><PiCreditCard aria-hidden="true" /></span>
                            <span>Generate Bill</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/menu-management')}>
                            <span className={Styles.btnIcon}><PiClipboardText aria-hidden="true" /></span>
                            <span>Manage Menu</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/restaurant-stock')}>
                            <span className={Styles.btnIcon}><PiPackage aria-hidden="true" /></span>
                            <span>Kitchen Stock</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
