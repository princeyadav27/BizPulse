import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Styles from '../styles/SideBar.module.css'
import { getStoredUser, subscribeAuth } from '../utils/authEvents'
import { PiBuildings, PiCashRegister, PiChartLine, PiClipboardText, PiClockCounterClockwise, PiCreditCard, PiFileText, PiForkKnife, PiGasPump, PiGauge, PiGearSix, PiPackage, PiStorefront, PiUploadSimple, PiUsersThree, PiWrench } from 'react-icons/pi'

const BUSINESS_META = {
    'petrol-pump': { label: 'Petrol Pump', short: 'PP', Icon: PiGasPump },
    'restaurant': { label: 'Restaurant', short: 'RT', Icon: PiForkKnife },
    'retail': { label: 'Retail Store', short: 'RL', Icon: PiStorefront },
    'service': { label: 'Service Center', short: 'SV', Icon: PiWrench },
    'multi-business': { label: 'Multi-Business', short: 'MB', Icon: PiBuildings }
};

const FALLBACK_META = { label: 'General', short: 'GN', Icon: PiBuildings };

const MENU_BY_BUSINESS = {
    'petrol-pump': [
        { name: 'Dashboard', path: '/dashboard', Icon: PiGauge },
        { name: 'Fuel Sales', path: '/fuel-sales', Icon: PiGasPump },
        { name: 'Stock Management', path: '/stock-management', Icon: PiPackage },
        { name: 'Staff Management', path: '/staff-management', Icon: PiUsersThree },
        { name: 'Sales Upload', path: '/sales-upload', Icon: PiUploadSimple }
    ],
    'restaurant': [
        { name: 'Dashboard', path: '/restaurant-dashboard', Icon: PiGauge },
        { name: 'Orders', path: '/restaurant-orders', Icon: PiForkKnife },
        { name: 'Billing', path: '/restaurant-billing', Icon: PiCreditCard },
        { name: 'Menu Management', path: '/menu-management', Icon: PiClipboardText },
        { name: 'Kitchen Stock', path: '/restaurant-stock', Icon: PiPackage },
        { name: 'Staff Management', path: '/restaurant-staff', Icon: PiUsersThree }
    ],
    'retail': [
        { name: 'Dashboard', path: '/retail-dashboard', Icon: PiGauge },
        { name: 'Sales Record', path: '/sales-upload', Icon: PiCashRegister },
        { name: 'Stock Management', path: '/stock-management', Icon: PiPackage },
        { name: 'Staff Management', path: '/staff-management', Icon: PiUsersThree }
    ],
    'service': [
        { name: 'Dashboard', path: '/service-dashboard', Icon: PiGauge },
        { name: 'Service Billing', path: '/sales-upload', Icon: PiWrench },
        { name: 'Service History', path: '/transactions', Icon: PiClockCounterClockwise },
        { name: 'Staff Management', path: '/staff-management', Icon: PiUsersThree }
    ],
    'default': [
        { name: 'Dashboard', path: '/dashboard', Icon: PiGauge },
        { name: 'Settings', path: '/settings', Icon: PiGearSix }
    ]
};

const INSIGHTS_MENU = [
    { name: 'Reports', path: '/reports', Icon: PiFileText },
    { name: 'Analytics', path: '/analytics', Icon: PiChartLine },
    { name: 'Settings', path: '/settings', Icon: PiGearSix }
];

const getInitials = (name) => {
    if (!name) return 'BP';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'BP';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const DynamicSideBar = () => {
    const [user, setUser] = useState(() => getStoredUser());

    useEffect(() => {
        const refresh = () => setUser(getStoredUser());
        refresh();
        return subscribeAuth(refresh);
    }, []);

    const businessType = user?.businessType || '';
    const meta = BUSINESS_META[businessType] || FALLBACK_META;
    const primaryItems = MENU_BY_BUSINESS[businessType] || MENU_BY_BUSINESS.default;
    const showInsights = businessType !== '';

    return (
        <aside className={Styles.sidebar} aria-label="Business navigation">
            <Link to="/" className={Styles.brand}>
                <span className={Styles.brandMark} aria-hidden="true">
                    <svg viewBox="0 0 64 64" width="22" height="22">
                        <path d="M10 38 L20 38 L26 18 L33 50 L39 30 L43 38 L54 38" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <span className={Styles.brandText}>BizPulse</span>
            </Link>

            <div className={Styles.workspace} title={meta.label}>
                <span className={Styles.workspaceBadge}>{meta.short}</span>
                <span className={Styles.workspaceMeta}>
                    <span className={Styles.workspaceLabel}>Workspace</span>
                    <span className={Styles.workspaceName}>{meta.label}</span>
                </span>
            </div>

            <nav className={Styles.sidebarNav}>
                <p className={Styles.navGroup}>Operations</p>
                {primaryItems.map((item) => (
                    <NavLink
                        key={item.path + item.name}
                        to={item.path}
                        title={item.name}
                        className={({ isActive }) =>
                            `${Styles.navItem} ${isActive ? Styles.active : ''}`
                        }
                    >
                        <item.Icon className={Styles.navIcon} aria-hidden="true" />
                        <span className={Styles.navText}>{item.name}</span>
                    </NavLink>
                ))}

                {showInsights && (
                    <>
                        <p className={Styles.navGroup}>Insights</p>
                        {INSIGHTS_MENU.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={item.name}
                                className={({ isActive }) =>
                                    `${Styles.navItem} ${isActive ? Styles.active : ''}`
                                }
                            >
                                <item.Icon className={Styles.navIcon} aria-hidden="true" />
                                <span className={Styles.navText}>{item.name}</span>
                            </NavLink>
                        ))}
                    </>
                )}
            </nav>

            <div className={Styles.sidebarFooter}>
                <span className={Styles.userAvatar} aria-hidden="true">
                    {getInitials(user?.name || user?.businessName)}
                </span>
                <span className={Styles.userDetails}>
                    <span className={Styles.userName}>{user?.name || 'Business Owner'}</span>
                    <span className={Styles.userRole}>{user?.businessName || meta.label}</span>
                </span>
            </div>
        </aside>
    );
};

export default DynamicSideBar;
