import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/ServiceDashboard.module.css'
import ThoughtsStyles from '../styles/BusinessThoughts.module.css'
import BusinessThoughts from './BusinessThoughts'
import BusinessNews from './BusinessNews'

const ServiceDashboard = () => {
    const navigate = useNavigate();
    const [userBusiness, setUserBusiness] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [serviceData, setServiceData] = useState({
        todayAppointments: 0,
        todayRevenue: 0,
        activeTechnicians: 0,
        totalTechnicians: 8,
        completedJobs: 0,
        pendingJobs: 0,
        avgServiceTime: 45,
        customerSatisfaction: 4.7,
        upcomingAppointments: [],
        partsInventory: [],
        technicianStatus: []
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
                businessName = parsedData.serviceName || 'My Service Center';
            }
            setBusinessName(businessName);
            setCurrentUserId(parsedData.id || parsedData.userId);
        }

        // Load service-specific data
        loadServiceData();
    }, []);

    const loadServiceData = () => {
        // Get current user data
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id || parsedUserData.userId;

        // Get today's sales data for service center - filter by current user
        const salesRecords = localStorage.getItem('salesData');
        const allSales = salesRecords ? JSON.parse(salesRecords) : [];
        const sales = allSales.filter(sale => sale.userId === userId);
        
        const today = new Date().toISOString().split('T')[0];
        const todaySales = sales.filter(item => item.date === today);
        
        // Calculate service metrics
        const totalRevenue = todaySales.reduce((sum, item) => {
            return sum + (parseFloat(item.totalSales) || 0);
        }, 0);
        
        const totalJobs = todaySales.length;

        setServiceData(prev => ({
            ...prev,
            todayAppointments: Math.floor(Math.random() * 20) + 10,
            todayRevenue: totalRevenue,
            activeTechnicians: 6,
            completedJobs: Math.floor(Math.random() * 15) + 8,
            pendingJobs: Math.floor(Math.random() * 8) + 2,
            avgServiceTime: 45,
            customerSatisfaction: 4.7,
            upcomingAppointments: [
                { time: '09:00 AM', customer: 'John Doe', service: 'Oil Change', status: 'confirmed' },
                { time: '10:30 AM', customer: 'Jane Smith', service: 'Brake Repair', status: 'confirmed' },
                { time: '02:00 PM', customer: 'Mike Johnson', service: 'Engine Diagnostics', status: 'pending' },
                { time: '04:00 PM', customer: 'Sarah Williams', service: 'Tire Rotation', status: 'confirmed' }
            ],
            partsInventory: [
                { name: 'Engine Oil', quantity: 45, minLevel: 20, status: 'good' },
                { name: 'Brake Pads', quantity: 8, minLevel: 10, status: 'low' },
                { name: 'Oil Filters', quantity: 32, minLevel: 15, status: 'good' },
                { name: 'Spark Plugs', quantity: 5, minLevel: 8, status: 'critical' }
            ],
            technicianStatus: [
                { name: 'Robert Chen', status: 'busy', currentJob: 'Oil Change', timeLeft: '15 min' },
                { name: 'Maria Garcia', status: 'available', skills: 'Engine, Transmission' },
                { name: 'James Wilson', status: 'busy', currentJob: 'Brake Repair', timeLeft: '30 min' },
                { name: 'Lisa Anderson', status: 'break', nextAvailable: '2:30 PM' }
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
        <div className={Styles.serviceDashboard}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <div>
                        <h1>{businessName}</h1>
                        <p className={Styles.subtitle}>Service Center Dashboard</p>
                    </div>
                    <div className={Styles.businessBadge}>
                        Business Type: <span>Service Center</span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className={Styles.kpiGrid}>
                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>🔧</div>
                        <div className={Styles.kpiContent}>
                            <h3>Today's Appointments</h3>
                            <p>{serviceData.todayAppointments}</p>
                            <span className={Styles.kpiChange}>+10% from yesterday</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>💰</div>
                        <div className={Styles.kpiContent}>
                            <h3>Today's Revenue</h3>
                            <p>{formatCurrency(serviceData.todayRevenue)}</p>
                            <span className={Styles.kpiChange}>+18% from yesterday</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>👨‍🔧</div>
                        <div className={Styles.kpiContent}>
                            <h3>Active Technicians</h3>
                            <p>{serviceData.activeTechnicians}/{serviceData.totalTechnicians}</p>
                            <span className={Styles.kpiChange}>75% utilized</span>
                        </div>
                    </div>

                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>⭐</div>
                        <div className={Styles.kpiContent}>
                            <h3>Customer Satisfaction</h3>
                            <p>{serviceData.customerSatisfaction}/5.0</p>
                            <span className={Styles.kpiChange}>Excellent</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className={Styles.appointments}>
                    <h2>Today's Appointments</h2>
                    <div className={Styles.appointmentGrid}>
                        {serviceData.upcomingAppointments.map((apt, index) => (
                            <div key={index} className={`${Styles.appointmentCard} ${Styles[apt.status]}`}>
                                <div className={Styles.appointmentTime}>
                                    <span className={Styles.time}>{apt.time}</span>
                                    <span className={Styles.status}>{apt.status}</span>
                                </div>
                                <div className={Styles.appointmentDetails}>
                                    <h4>{apt.customer}</h4>
                                    <p>{apt.service}</p>
                                </div>
                                <div className={Styles.appointmentActions}>
                                    <button className={Styles.actionBtnSmall}>Check In</button>
                                    <button className={Styles.actionBtnSmall}>Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technician Status */}
                <div className={Styles.technicianStatus}>
                    <h2>Technician Status</h2>
                    <div className={Styles.technicianGrid}>
                        {serviceData.technicianStatus.map((tech, index) => (
                            <div key={index} className={`${Styles.techCard} ${Styles[tech.status]}`}>
                                <div className={Styles.techInfo}>
                                    <h4>{tech.name}</h4>
                                    <p className={Styles.techStatus}>{tech.status}</p>
                                    {tech.currentJob && (
                                        <p className={Styles.currentJob}>{tech.currentJob}</p>
                                    )}
                                    {tech.timeLeft && (
                                        <span className={Styles.timeLeft}>{tech.timeLeft}</span>
                                    )}
                                    {tech.nextAvailable && (
                                        <span className={Styles.nextAvailable}>Available: {tech.nextAvailable}</span>
                                    )}
                                    {tech.skills && (
                                        <span className={Styles.skills}>{tech.skills}</span>
                                    )}
                                </div>
                                <div className={Styles.techActions}>
                                    <button className={Styles.actionBtnSmall}>Assign Job</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Parts Inventory */}
                <div className={Styles.partsInventory}>
                    <h2>Parts Inventory Status</h2>
                    <div className={Styles.partsGrid}>
                        {serviceData.partsInventory.map((part, index) => (
                            <div key={index} className={`${Styles.partCard} ${Styles[part.status]}`}>
                                <div className={Styles.partInfo}>
                                    <h4>{part.name}</h4>
                                    <p>Quantity: {part.quantity}</p>
                                    <p>Min Level: {part.minLevel}</p>
                                </div>
                                <div className={Styles.partStatus}>
                                    <span className={`${Styles.statusBadge} ${Styles[part.status]}`}>
                                        {part.status}
                                    </span>
                                    {part.status !== 'good' && (
                                        <button className={Styles.orderBtn}>Order Now</button>
                                    )}
                                </div>
                            </div>
                        ))}
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
                            <span className={Styles.btnIcon}>📅</span>
                            <span>New Appointment</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/sales-upload')}>
                            <span className={Styles.btnIcon}>🔧</span>
                            <span>Job Management</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/stock-management')}>
                            <span className={Styles.btnIcon}>⚙️</span>
                            <span>Parts Inventory</span>
                        </button>
                        <button className={Styles.actionBtn} onClick={() => navigate('/customers')}>
                            <span className={Styles.btnIcon}>👥</span>
                            <span>Customer Management</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDashboard;
