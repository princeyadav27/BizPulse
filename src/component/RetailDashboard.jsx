import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/RetailDashboard.module.css'
import ThoughtsStyles from '../styles/BusinessThoughts.module.css'
import BusinessThoughts from './BusinessThoughts'
import BusinessNews from './BusinessNews'
import { PiChartLine, PiCurrencyInr, PiLightning, PiPackage, PiShoppingCart, PiUsersThree, PiWarning } from 'react-icons/pi'

const RetailDashboard = () => {
    const navigate = useNavigate();
    const [userBusiness, setUserBusiness] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [retailData, setRetailData] = useState({
        todaySales: 0,
        todayOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
        topProducts: [],
        lowStock: [],
        staffOnDuty: 8,
        storeCapacity: 85
    });

    useEffect(() => {
        // Get user data
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserBusiness(parsedData.businessType);
            
            // Set business name with proper fallbacks
            let businessName = parsedData.businessName;
            if (!businessName) {
                businessName = parsedData.retailName || 'My Retail Store';
            }
            setBusinessName(businessName);
            setCurrentUserId(parsedData.id || parsedData.userId);
        }

        // Load retail-specific data
        loadRetailData();
    }, []);

    const loadRetailData = () => {
        // Get current user data
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id || parsedUserData.userId;

        // Get today's sales data for retail - filter by current user
        const salesRecords = localStorage.getItem('salesData');
        const allSales = salesRecords ? JSON.parse(salesRecords) : [];
        const sales = allSales.filter(sale => sale.userId === userId);
        
        const today = new Date().toISOString().split('T')[0];
        const todaySales = sales.filter(item => item.date === today);
        
        // Calculate retail metrics
        const totalRevenue = todaySales.reduce((sum, item) => {
            return sum + (parseFloat(item.totalSales) || 0);
        }, 0);
        
        const totalOrders = todaySales.length;
        const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setRetailData(prev => ({
            ...prev,
            todaySales: totalRevenue,
            todayOrders: totalOrders,
            avgOrderValue: avgOrder,
            totalCustomers: Math.floor(Math.random() * 150) + 50, // Simulated customers
            topProducts: [
                { name: 'Laptop Dell', sales: 15, revenue: 225000, stock: 8 },
                { name: 'iPhone 15', sales: 12, revenue: 1080000, stock: 3 },
                { name: 'Samsung TV', sales: 8, revenue: 320000, stock: 12 },
                { name: 'Headphones', sales: 25, revenue: 125000, stock: 45 }
            ],
            lowStock: [
                { name: 'iPhone 15', current: 3, min: 5, status: 'critical' },
                { name: 'Laptop Dell', current: 8, min: 10, status: 'warning' }
            ]
        }));
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
        <div className={Styles.retailDashboard}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <div>
                        <h1>{businessName}</h1>
                        <p className={Styles.subtitle}>Retail Store Dashboard</p>
                    </div>
                    <div className={Styles.businessBadge}>
                        Business Type: <span>Retail</span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className={Styles.kpiGrid}>
                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiCurrencyInr aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Today's Sales</h3>
                            <p>{formatCurrency(retailData.todaySales)}</p>
                            <span className={Styles.kpiChange}>+15% from yesterday</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiPackage aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Orders Today</h3>
                            <p>{retailData.todayOrders}</p>
                            <span className={Styles.kpiChange}>+8% from yesterday</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiUsersThree aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Customers Today</h3>
                            <p>{retailData.totalCustomers}</p>
                            <span className={Styles.kpiChange}>+12% from yesterday</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}><PiChartLine aria-hidden="true" /></div>
                        <div className={Styles.kpiContent}>
                            <h3>Avg Order Value</h3>
                            <p>{formatCurrency(retailData.avgOrderValue)}</p>
                            <span className={Styles.kpiChange}>+5% from yesterday</span>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className={Styles.topProducts}>
                    <h2>Top Selling Products</h2>
                    <div className={Styles.productsGrid}>
                        {retailData.topProducts.map((product, index) => (
                            <div key={index} className={Styles.productCard}>
                                <div className={Styles.productInfo}>
                                    <h4>{product.name}</h4>
                                    <p>{product.sales} units sold</p>
                                    <span className={Styles.stockBadge}>
                                        Stock: {product.stock}
                                    </span>
                                </div>
                                <div className={Styles.productRevenue}>
                                    <p>{formatCurrency(product.revenue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className={Styles.inventoryAlerts}>
                    <h2>Inventory Alerts</h2>
                    <div className={Styles.alertsGrid}>
                        {retailData.lowStock.map((item, index) => (
                            <div key={index} className={`${Styles.alertCard} ${Styles[item.status]}`}>
                                <div className={Styles.alertIcon}>
                                    {item.status === 'critical' ? <PiWarning aria-hidden="true" /> : <PiLightning aria-hidden="true" />}
                                </div>
                                <div className={Styles.alertContent}>
                                    <h4>{item.name}</h4>
                                    <p>
                                        {item.status === 'critical' ? 
                                            `Critical: Only ${item.current} left (Min: ${item.min})` :
                                            `Low: ${item.current} left (Min: ${item.min})`
                                        }
                                    </p>
                                    <button className={Styles.alertBtn}>
                                        Reorder Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Store Status */}
                <div className={Styles.storeStatus}>
                    <h2>Store Status</h2>
                    <div className={Styles.statusGrid}>
                        <div className={Styles.statusCard}>
                            <h4>Store Capacity</h4>
                            <p>{retailData.storeCapacity}%</p>
                            <div className={Styles.progressBar}>
                                <div 
                                    className={Styles.progressFill}
                                    style={{ width: `${retailData.storeCapacity}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className={Styles.statusCard}>
                            <h4>Staff on Duty</h4>
                            <p>{retailData.staffOnDuty} members</p>
                            <span className={Styles.statusBadge}>Fully Staffed</span>
                        </div>
                        <div className={Styles.statusCard}>
                            <h4>Peak Hours</h4>
                            <p>2:00 PM - 6:00 PM</p>
                            <span className={Styles.statusBadge}>High Traffic</span>
                        </div>
                        <div className={Styles.statusCard}>
                            <h4>Security</h4>
                            <p>All Systems Active</p>
                            <span className={Styles.statusBadge}>Secured</span>
                        </div>
                    </div>
                </div>

                {/* Feed Grid wrapping Business Thoughts & News */}
                <div className={ThoughtsStyles.feedGrid}>
                    <BusinessThoughts businessType={userBusiness} />
                    <BusinessNews businessType={userBusiness} />
                </div>

                {/* Quick Actions */}
                <div className={Styles.quickActions}>
                    <h2>Quick Actions</h2>
                    <div className={Styles.actionsGrid}>
                        <button className={Styles.actionBtn} onClick={() => navigate('/sales-upload')}>
                            <span className={Styles.btnIcon}><PiShoppingCart aria-hidden="true" /></span>
                            <span>New Sale</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/stock-management')}>
                            <span className={Styles.btnIcon}><PiPackage aria-hidden="true" /></span>
                            <span>Inventory</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/customers')}>
                            <span className={Styles.btnIcon}><PiUsersThree aria-hidden="true" /></span>
                            <span>Customers</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/reports')}>
                            <span className={Styles.btnIcon}><PiChartLine aria-hidden="true" /></span>
                            <span>Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailDashboard;
