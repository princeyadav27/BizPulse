import { Link, useLocation } from 'react-router-dom'
import Styles from '../styles/SideBar.module.css'
import {
    FaHome,
    FaGasPump,
    FaUtensils,
    FaStore,
    FaWrench,
    FaExchangeAlt,
    FaBoxes,
    FaFileAlt,
    FaCog
} from 'react-icons/fa'

const SideBar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
        { name: 'Petrol Pump', path: '/petrol-pump', icon: <FaGasPump /> },
        { name: 'Restaurant', path: '/restaurant', icon: <FaUtensils /> },
        { name: 'Retail Store', path: '/retail', icon: <FaStore /> },
        { name: 'Service Center', path: '/service', icon: <FaWrench /> },
        { name: 'All Transactions', path: '/transactions', icon: <FaExchangeAlt /> },
        { name: 'Inventory', path: '/inventory', icon: <FaBoxes /> },
        { name: 'Reports', path: '/reports', icon: <FaFileAlt /> },
        { name: 'Settings', path: '/settings', icon: <FaCog /> }
    ];

    return (
        <div className={Styles.sidebar}>
            <div className={Styles.logo}>
                <h2>BizPulse</h2>
            </div>
            <nav className={Styles.nav}>
                <ul className={Styles.menuList}>
                    {menuItems.map((item) => (
                        <li key={item.name} className={Styles.menuItem}>
                            <Link 
                                to={item.path} 
                                className={`${Styles.menuLink} ${
                                    location.pathname === item.path ? Styles.active : ''
                                }`}
                            >
                                <span className={Styles.icon}>{item.icon}</span>
                                <span className={Styles.text}>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default SideBar;