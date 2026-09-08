import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/BusinessDashboard.module.css'
import ThoughtsStyles from '../styles/BusinessThoughts.module.css'
import BusinessThoughts from './BusinessThoughts'
import BusinessNews from './BusinessNews'

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const [userBusiness, setUserBusiness] = useState('');
    const [dashboardData, setDashboardData] = useState({});
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserBusiness(parsedData.businessType);
            
            // Get sales data from localStorage
            const salesRecords = localStorage.getItem('salesData');
            const sales = salesRecords ? JSON.parse(salesRecords) : [];
            setSalesData(sales);
            
            // Calculate today's sales
            const today = new Date().toISOString().split('T')[0];
            const todaySales = sales.filter(item => item.date === today);
            
            // Calculate totals from uploaded data
            const totals = todaySales.reduce((acc, item) => {
                acc.petrolSales += parseFloat(item.petrolSales) || 0;
                acc.petrolLiters += parseFloat(item.petrolLiters) || 0;
                acc.dieselSales += parseFloat(item.dieselSales) || 0;
                acc.dieselLiters += parseFloat(item.dieselLiters) || 0;
                acc.cngSales += parseFloat(item.cngSales) || 0;
                acc.cngLiters += parseFloat(item.cngLiters) || 0;
                acc.otherSales += parseFloat(item.otherSales) || 0;
                acc.vaporRecovery += parseFloat(item.vaporRecovery) || 0;
                acc.totalSales += parseFloat(item.totalSales) || 0;
                return acc;
            }, { 
                petrolSales: 0, petrolLiters: 0, dieselSales: 0, dieselLiters: 0,
                cngSales: 0, cngLiters: 0, otherSales: 0, vaporRecovery: 0, totalSales: 0
            });
            
            // Set dashboard data based on business type and real data
            switch(parsedData.businessType) {
                case 'petrol-pump':
                    setDashboardData({
                        title: 'Petrol Pump Dashboard',
                        kpiCards: [
                            { title: 'Today\'s Petrol Sales', value: `₹${totals.petrolSales.toFixed(2)}`, change: todaySales.length > 0 ? '+12%' : '0%', icon: '⛽' },
                            { title: 'Today\'s Diesel Sales', value: `₹${totals.dieselSales.toFixed(2)}`, change: todaySales.length > 0 ? '+8%' : '0%', icon: '🛢️' },
                            { title: 'Today\'s CNG Sales', value: `₹${totals.cngSales.toFixed(2)}`, change: todaySales.length > 0 ? '+5%' : '0%', icon: '⛽' },
                            { title: 'Total Sales Today', value: `₹${totals.totalSales.toFixed(2)}`, change: todaySales.length > 0 ? '+10%' : '0%', icon: '�' }
                        ],
                        features: [
                            `Petrol: ${totals.petrolLiters.toFixed(0)}L sold`,
                            `Diesel: ${totals.dieselLiters.toFixed(0)}L sold`,
                            `CNG: ${totals.cngLiters.toFixed(0)}L sold`,
                            `Vapor Recovery: ${totals.vaporRecovery}L`
                        ]
                    });
                    break;
                    
                case 'restaurant':
                    setDashboardData({
                        title: 'Restaurant Dashboard',
                        kpiCards: [
                            { title: 'Today\'s Revenue', value: `₹${totals.totalSales.toFixed(2)}`, change: '+8%', icon: '🍽️' },
                            { title: 'Orders Today', value: todaySales.length.toString(), change: '+15%', icon: '📝' },
                            { title: 'Table Occupancy', value: '78%', change: '+5%', icon: '🪑' },
                            { title: 'Food Cost', value: `₹${(totals.totalSales * 0.3).toFixed(2)}`, change: '-3%', icon: '🥘' }
                        ],
                        features: ['Order Management', 'Table Booking', 'Inventory', 'Staff Management']
                    });
                    break;
                    
                case 'retail':
                    setDashboardData({
                        title: 'Retail Store Dashboard',
                        kpiCards: [
                            { title: 'Today\'s Sales', value: `₹${totals.totalSales.toFixed(2)}`, change: '+15%', icon: '🏪' },
                            { title: 'Items Sold', value: todaySales.length.toString(), change: '+12%', icon: '📦' },
                            { title: 'Customers Today', value: Math.floor(totals.totalSales / 500).toString(), change: '+8%', icon: '👥' },
                            { title: 'Stock Value', value: '₹2,34,567', change: '+5%', icon: '💰' }
                        ],
                        features: ['Sales Tracking', 'Inventory Management', 'Customer Data', 'Analytics']
                    });
                    break;
                    
                case 'service':
                    setDashboardData({
                        title: 'Service Center Dashboard',
                        kpiCards: [
                            { title: 'Today\'s Revenue', value: `₹${totals.totalSales.toFixed(2)}`, change: '+5%', icon: '🔧' },
                            { title: 'Appointments', value: todaySales.length.toString(), change: '+10%', icon: '📅' },
                            { title: 'Services Completed', value: todaySales.length.toString(), change: '+8%', icon: '✅' },
                            { title: 'Parts Sold', value: `₹${totals.otherSales.toFixed(2)}`, change: '+12%', icon: '⚙️' }
                        ],
                        features: ['Appointment Booking', 'Service History', 'Parts Inventory', 'Customer Management']
                    });
                    break;
                    
                case 'multi-business':
                    setDashboardData({
                        title: 'Multi-Business Dashboard',
                        kpiCards: [
                            { title: 'Petrol Pump Sales', value: `₹${totals.petrolSales.toFixed(2)}`, change: '+12%', icon: '⛽' },
                            { title: 'Restaurant Sales', value: `₹${totals.totalSales.toFixed(2)}`, change: '+8%', icon: '🍽️' },
                            { title: 'Retail Store Sales', value: `₹${totals.totalSales.toFixed(2)}`, change: '+15%', icon: '🏪' },
                            { title: 'Service Center', value: `₹${totals.totalSales.toFixed(2)}`, change: '+5%', icon: '🔧' }
                        ],
                        features: ['Multi-Business Analytics', 'Cross-Business Reports', 'Unified Inventory', 'Central Management']
                    });
                    break;
                    
                default:
                    setDashboardData({
                        title: 'General Dashboard',
                        kpiCards: [
                            { title: 'Total Revenue', value: `₹${totals.totalSales.toFixed(2)}`, change: totals.totalSales > 0 ? '+10%' : '0%', icon: '💰' },
                            { title: 'Transactions Today', value: todaySales.length.toString(), change: todaySales.length > 0 ? '+12%' : '0%', icon: '👥' },
                            { title: 'Active Services', value: '4', change: '0%', icon: '🏢' },
                            { title: 'Growth Rate', value: '15%', change: '+3%', icon: '📈' }
                        ],
                        features: ['Business Overview', 'Revenue Analytics', 'Customer Insights', 'Performance Metrics']
                    });
            }
        }
    }, []);

    return (
        <div className={Styles.dashboard}>
            <div className={Styles.header}>
                <h1 className={Styles.title}>{dashboardData.title}</h1>
                <div className={Styles.businessBadge}>
                    Business Type: <span>{userBusiness}</span>
                </div>
                {salesData.length > 0 && (
                    <div className={Styles.dataBadge}>
                        {salesData.length} Sales Records
                    </div>
                )}
            </div>

            <div className={Styles.kpiSection}>
                <div className={Styles.kpiCards}>
                    {dashboardData.kpiCards?.map((kpi, index) => (
                        <div key={index} className={Styles.kpiCard}>
                            <div className={Styles.kpiIcon}>{kpi.icon}</div>
                            <div className={Styles.kpiContent}>
                                <h3 className={Styles.kpiTitle}>{kpi.title}</h3>
                                <p className={Styles.kpiValue}>{kpi.value}</p>
                                <span className={`${Styles.kpiChange} ${kpi.change.startsWith('+') ? Styles.positive : Styles.negative}`}>
                                    {kpi.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={Styles.featuresSection}>
                <h2 className={Styles.sectionTitle}>Today's Performance</h2>
                <div className={Styles.featuresGrid}>
                    {dashboardData.features?.map((feature, index) => (
                        <div key={index} className={Styles.featureCard}>
                            <div className={Styles.featureIcon}>✨</div>
                            <h3>Performance Metric</h3>
                            <p>{feature}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feed Grid wrapping Business Thoughts & News */}
            <div className={ThoughtsStyles.feedGrid}>
                <BusinessThoughts businessType={userBusiness} />
                <BusinessNews businessType={userBusiness} />
            </div>

            <div className={Styles.actionsSection}>
                <h2 className={Styles.sectionTitle}>Quick Actions</h2>
                <div className={Styles.actionsGrid}>
                    <button className={Styles.actionBtn} onClick={() => navigate('/reports')}>
                        <span className={Styles.btnIcon}>📊</span>
                        View Reports
                    </button>
                    <button className={Styles.actionBtn} onClick={() => navigate('/sales-upload')}>
                        <span className={Styles.btnIcon}>📤</span>
                        Upload Sales
                    </button>
                    <button className={Styles.actionBtn} onClick={() => navigate('/analytics')}>
                        <span className={Styles.btnIcon}>📈</span>
                        Analytics
                    </button>
                    <button className={Styles.actionBtn} onClick={() => navigate('/customers')}>
                        <span className={Styles.btnIcon}>👥</span>
                        Manage Customers
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;
