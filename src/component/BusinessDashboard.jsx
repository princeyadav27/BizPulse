import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/BusinessDashboard.module.css'
import ThoughtsStyles from '../styles/BusinessThoughts.module.css'
import BusinessThoughts from './BusinessThoughts'
import BusinessNews from './BusinessNews'
import { PiArmchair, PiBowlFood, PiBuildings, PiCalendarCheck, PiChartLine, PiCheckCircle, PiCoin, PiCurrencyInr, PiDrop, PiFileText, PiForkKnife, PiGasPump, PiGearSix, PiPackage, PiReceipt, PiSparkle, PiStorefront, PiTrendUp, PiUploadSimple, PiUsersThree, PiWrench } from 'react-icons/pi'

const BUSINESS_LABELS = {
    'petrol-pump': 'Petrol Pump',
    'restaurant': 'Restaurant',
    'retail': 'Retail Store',
    'service': 'Service Center',
    'multi-business': 'Multi-Business'
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const [userBusiness, setUserBusiness] = useState('');
    const [userName, setUserName] = useState('');
    const [dashboardData, setDashboardData] = useState({});
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserBusiness(parsedData.businessType);
            setUserName((parsedData.name || '').split(' ')[0] || '');

            const salesRecords = localStorage.getItem('salesData');
            const sales = salesRecords ? JSON.parse(salesRecords) : [];
            setSalesData(sales);

            const today = new Date().toISOString().split('T')[0];
            const todaySales = sales.filter(item => item.date === today);

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

            switch(parsedData.businessType) {
                case 'petrol-pump':
                    setDashboardData({
                        title: 'Petrol Pump Dashboard',
                        kpiCards: [
                            { title: "Today's Petrol Sales", value: `₹${totals.petrolSales.toFixed(2)}`, change: todaySales.length > 0 ? '+12%' : '0%', Icon: PiGasPump },
                            { title: "Today's Diesel Sales", value: `₹${totals.dieselSales.toFixed(2)}`, change: todaySales.length > 0 ? '+8%' : '0%', Icon: PiDrop },
                            { title: "Today's CNG Sales", value: `₹${totals.cngSales.toFixed(2)}`, change: todaySales.length > 0 ? '+5%' : '0%', Icon: PiGasPump },
                            { title: 'Total Sales Today', value: `₹${totals.totalSales.toFixed(2)}`, change: todaySales.length > 0 ? '+10%' : '0%', Icon: PiCurrencyInr }
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
                            { title: "Today's Revenue", value: `₹${totals.totalSales.toFixed(2)}`, change: '+8%', Icon: PiCoin },
                            { title: 'Orders Today', value: todaySales.length.toString(), change: '+15%', Icon: PiReceipt },
                            { title: 'Table Occupancy', value: '78%', change: '+5%', Icon: PiArmchair },
                            { title: 'Food Cost', value: `₹${(totals.totalSales * 0.3).toFixed(2)}`, change: '-3%', Icon: PiBowlFood }
                        ],
                        features: ['Order Management', 'Table Booking', 'Inventory', 'Staff Management']
                    });
                    break;

                case 'retail':
                    setDashboardData({
                        title: 'Retail Store Dashboard',
                        kpiCards: [
                            { title: "Today's Sales", value: `₹${totals.totalSales.toFixed(2)}`, change: '+15%', Icon: PiStorefront },
                            { title: 'Items Sold', value: todaySales.length.toString(), change: '+12%', Icon: PiPackage },
                            { title: 'Customers Today', value: Math.floor(totals.totalSales / 500).toString(), change: '+8%', Icon: PiUsersThree },
                            { title: 'Stock Value', value: '₹2,34,567', change: '+5%', Icon: PiCurrencyInr }
                        ],
                        features: ['Sales Tracking', 'Inventory Management', 'Customer Data', 'Analytics']
                    });
                    break;

                case 'service':
                    setDashboardData({
                        title: 'Service Center Dashboard',
                        kpiCards: [
                            { title: "Today's Revenue", value: `₹${totals.totalSales.toFixed(2)}`, change: '+5%', Icon: PiCoin },
                            { title: 'Appointments', value: todaySales.length.toString(), change: '+10%', Icon: PiCalendarCheck },
                            { title: 'Services Completed', value: todaySales.length.toString(), change: '+8%', Icon: PiCheckCircle },
                            { title: 'Parts Sold', value: `₹${totals.otherSales.toFixed(2)}`, change: '+12%', Icon: PiGearSix }
                        ],
                        features: ['Appointment Booking', 'Service History', 'Parts Inventory', 'Customer Management']
                    });
                    break;

                case 'multi-business':
                    setDashboardData({
                        title: 'Multi-Business Dashboard',
                        kpiCards: [
                            { title: 'Petrol Pump Sales', value: `₹${totals.petrolSales.toFixed(2)}`, change: '+12%', Icon: PiGasPump },
                            { title: 'Restaurant Sales', value: `₹${totals.totalSales.toFixed(2)}`, change: '+8%', Icon: PiForkKnife },
                            { title: 'Retail Store Sales', value: `₹${totals.totalSales.toFixed(2)}`, change: '+15%', Icon: PiStorefront },
                            { title: 'Service Center', value: `₹${totals.totalSales.toFixed(2)}`, change: '+5%', Icon: PiWrench }
                        ],
                        features: ['Multi-Business Analytics', 'Cross-Business Reports', 'Unified Inventory', 'Central Management']
                    });
                    break;

                default:
                    setDashboardData({
                        title: 'Business Dashboard',
                        kpiCards: [
                            { title: 'Total Revenue', value: `₹${totals.totalSales.toFixed(2)}`, change: totals.totalSales > 0 ? '+10%' : '0%', Icon: PiCurrencyInr },
                            { title: 'Transactions Today', value: todaySales.length.toString(), change: todaySales.length > 0 ? '+12%' : '0%', Icon: PiReceipt },
                            { title: 'Active Services', value: '4', change: '0%', Icon: PiBuildings },
                            { title: 'Growth Rate', value: '15%', change: '+3%', Icon: PiTrendUp }
                        ],
                        features: ['Business Overview', 'Revenue Analytics', 'Customer Insights', 'Performance Metrics']
                    });
            }
        }
    }, []);

    const businessLabel = BUSINESS_LABELS[userBusiness] || 'General';

    return (
        <div className={Styles.dashboard}>
            <header className={Styles.header}>
                <div className={Styles.headerText}>
                    <p className={Styles.greeting}>
                        {getGreeting()}{userName ? `, ${userName}` : ''}
                    </p>
                    <h1 className={Styles.title}>{dashboardData.title || 'Business Dashboard'}</h1>
                    <p className={Styles.subtitle}>
                        Here is where your {businessLabel.toLowerCase()} stands right now.
                    </p>
                </div>
                <div className={Styles.headerBadges}>
                    <span className={Styles.businessBadge}>{businessLabel}</span>
                    {salesData.length > 0 && (
                        <span className={Styles.dataBadge}>{salesData.length} sales records</span>
                    )}
                </div>
            </header>

            <section className={Styles.kpiSection} aria-label="Key performance indicators">
                <div className={Styles.kpiCards}>
                    {dashboardData.kpiCards?.map((kpi, index) => (
                        <div key={index} className={Styles.kpiCard} style={{ animationDelay: `${index * 70}ms` }}>
                            <div className={Styles.kpiIcon}><kpi.Icon aria-hidden="true" /></div>
                            <div className={Styles.kpiContent}>
                                <h3 className={Styles.kpiTitle}>{kpi.title}</h3>
                                <p className={Styles.kpiValue}>{kpi.value}</p>
                                <span className={`${Styles.kpiChange} ${kpi.change.startsWith('+') ? Styles.positive : kpi.change.startsWith('-') ? Styles.negative : Styles.neutral}`}>
                                    {kpi.change.startsWith('+') ? <PiTrendUp aria-hidden="true" /> : null}
                                    {kpi.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={Styles.featuresSection}>
                <div className={Styles.sectionHead}>
                    <h2 className={Styles.sectionTitle}>Today's performance</h2>
                    <p className={Styles.sectionSub}>Live snapshot from your recorded sales</p>
                </div>
                <div className={Styles.featuresGrid}>
                    {dashboardData.features?.map((feature, index) => (
                        <div key={index} className={Styles.featureCard} style={{ animationDelay: `${index * 70}ms` }}>
                            <div className={Styles.featureIcon}><PiSparkle aria-hidden="true" /></div>
                            <p>{feature}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feed Grid wrapping Business Thoughts & News */}
            <div className={ThoughtsStyles.feedGrid}>
                <BusinessThoughts businessType={userBusiness} />
                <BusinessNews businessType={userBusiness} />
            </div>

            <section className={Styles.actionsSection}>
                <div className={Styles.sectionHead}>
                    <h2 className={Styles.sectionTitle}>Quick actions</h2>
                    <p className={Styles.sectionSub}>Jump straight into the day's work</p>
                </div>
                <div className={Styles.actionsGrid}>
                    <button className={Styles.actionBtn} onClick={() => navigate('/reports')}>
                        <span className={Styles.btnIcon}><PiFileText aria-hidden="true" /></span>
                        <span className={Styles.btnText}>
                            <strong>View reports</strong>
                            <small>Daily close and exports</small>
                        </span>
                    </button>
                    <button className={Styles.actionBtn} onClick={() => navigate('/sales-upload')}>
                        <span className={Styles.btnIcon}><PiUploadSimple aria-hidden="true" /></span>
                        <span className={Styles.btnText}>
                            <strong>Upload sales</strong>
                            <small>Record today's counter entries</small>
                        </span>
                    </button>
                    <button className={Styles.actionBtn} onClick={() => navigate('/analytics')}>
                        <span className={Styles.btnIcon}><PiChartLine aria-hidden="true" /></span>
                        <span className={Styles.btnText}>
                            <strong>Analytics</strong>
                            <small>Trends, peaks and insights</small>
                        </span>
                    </button>
                    <button className={Styles.actionBtn} onClick={() => navigate('/customers')}>
                        <span className={Styles.btnIcon}><PiUsersThree aria-hidden="true" /></span>
                        <span className={Styles.btnText}>
                            <strong>Manage customers</strong>
                            <small>Loyalty, history and contacts</small>
                        </span>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default BusinessDashboard;
