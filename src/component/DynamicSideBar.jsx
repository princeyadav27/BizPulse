import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Styles from '../styles/SideBar.module.css'
import {
    FaHome,
    FaGasPump,
    FaBoxes,
    FaFileAlt,
    FaChartLine,
    FaUsers,
    FaUpload,
    FaUtensils,
    FaCreditCard,
    FaClipboardList,
    FaCashRegister,
    FaBoxOpen,
    FaWrench,
    FaCalendarAlt,
    FaCog
} from 'react-icons/fa'

const DynamicSideBar = () => {
    const location = useLocation();
    const [userBusiness, setUserBusiness] = useState('');
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const updateSidebar = () => {
            console.log('BizPulse - DynamicSideBar - Updating sidebar');

            // Get current user data
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const currentBusinessType = parsedData.businessType;

                console.log('BizPulse - DynamicSideBar - Current business type:', currentBusinessType);
                setUserBusiness(currentBusinessType);

                // Update menu based on business type
                switch (currentBusinessType) {
                    case 'petrol-pump':
                        setMenuItems([
                            { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
                            { name: 'Fuel Sales', path: '/fuel-sales', icon: <FaGasPump /> },
                            { name: 'Stock Management', path: '/stock-management', icon: <FaBoxes /> },
                            { name: 'Reports', path: '/reports', icon: <FaFileAlt /> },
                            { name: 'Analytics', path: '/analytics', icon: <FaChartLine /> },
                            { name: 'Staff Management', path: '/staff-management', icon: <FaUsers /> },
                            { name: 'Sales Upload', path: '/sales-upload', icon: <FaUpload /> }
                        ]);
                        break;
                    case 'restaurant':
                        setMenuItems([
                            { name: 'Dashboard', path: '/restaurant-dashboard', icon: <FaHome /> },
                            { name: 'Orders', path: '/restaurant-orders', icon: <FaUtensils /> },
                            { name: 'Billing', path: '/restaurant-billing', icon: <FaCreditCard /> },
                            { name: 'Menu Management', path: '/menu-management', icon: <FaClipboardList /> },
                            { name: 'Kitchen Stock', path: '/restaurant-stock', icon: <FaBoxes /> },
                            { name: 'Staff Management', path: '/restaurant-staff', icon: <FaUsers /> },
                            { name: 'Reports', path: '/reports', icon: <FaFileAlt /> },
                            { name: 'Analytics', path: '/analytics', icon: <FaChartLine /> }
                        ]);
                        break;
                    case 'retail':
                        setMenuItems([
                            { name: 'Dashboard', path: '/retail-dashboard', icon: <FaHome /> },
                            { name: 'Sales Record', path: '/sales-upload', icon: <FaCashRegister /> },
                            { name: 'Stock Management', path: '/stock-management', icon: <FaBoxes /> },
                            { name: 'Staff Management', path: '/staff-management', icon: <FaUsers /> },
                            { name: 'Reports', path: '/reports', icon: <FaFileAlt /> },
                            { name: 'Analytics', path: '/analytics', icon: <FaChartLine /> }
                        ]);
                        break;
                    case 'service':
                        setMenuItems([
                            { name: 'Dashboard', path: '/service-dashboard', icon: <FaHome /> },
                            { name: 'Service Billing', path: '/sales-upload', icon: <FaWrench /> },
                            { name: 'Service History', path: '/transactions', icon: <FaCalendarAlt /> },
                            { name: 'Staff Management', path: '/staff-management', icon: <FaUsers /> },
                            { name: 'Reports', path: '/reports', icon: <FaFileAlt /> },
                            { name: 'Analytics', path: '/analytics', icon: <FaChartLine /> }
                        ]);
                        break;
                    default:
                        setMenuItems([
                            { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
                            { name: 'Analytics', path: '/analytics', icon: <FaChartLine /> },
                            { name: 'Settings', path: '/settings', icon: <FaCog /> }
                        ]);
                }
            }
        };

        // Initial load
        updateSidebar();

        // Listen for storage changes
        const handleStorageChange = () => {
            console.log('DynamicSideBar - Storage changed, updating sidebar');
            updateSidebar();
        };

        window.addEventListener('storage', handleStorageChange);

        // Check periodically (for same-tab updates)
        const interval = setInterval(updateSidebar, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const getBusinessIcon = (businessType) => {
        const icons = {
            'petrol-pump': '⛽',
            'restaurant': '🍽️',
            'retail': '🏪',
            'service': '🔧',
            'multi-business': '🏢'
        };
        return icons[businessType] || '🏢';
    };

    const getBusinessName = (businessType) => {
        const names = {
            'petrol-pump': 'Petrol Pump',
            'restaurant': 'Restaurant',
            'retail': 'Retail Store',
            'service': 'Service Center',
            'multi-business': 'Multi-Business'
        };
        return names[businessType] || 'General';
    };

    return (
        <div className={Styles.sidebar}>
            <div className={Styles.sidebarHeader}>
                <h3>Business Menu</h3>
                <div className={Styles.businessType} data-business={userBusiness}>
                    {getBusinessIcon(userBusiness)} {getBusinessName(userBusiness)}
                </div>
            </div>

            <nav className={Styles.sidebarNav}>
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`${Styles.navItem} ${location.pathname === item.path ? Styles.active : ''}`}
                        data-nav={userBusiness}
                    >
                        <span className={Styles.navIcon}>{item.icon}</span>
                        <span className={Styles.navText}>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className={Styles.sidebarFooter}>
                <div className={Styles.userInfo}>
                    <div className={Styles.userAvatar}>👤</div>
                    <div className={Styles.userDetails}>
                        <p className={Styles.userName}>Business Owner</p>
                        <p className={Styles.userRole}>{getBusinessName(userBusiness)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicSideBar;
