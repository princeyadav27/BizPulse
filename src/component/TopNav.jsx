import { Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './Home'
import BusinessDashboard from './BusinessDashboard'
import RestaurantDashboard from './RestaurantDashboard'
import RetailDashboard from './RetailDashboard'
import ServiceDashboard from './ServiceDashboard'
import SalesUpload from './SalesUpload'
import Analytics from './Analytics'
import StockManagement from './StockManagement'
import FuelSales from './FuelSales'
import Transactions from './Transactions'
import Reports from './Reports'
import Settings from './Settings'
import RestaurantOrderManagement from './RestaurantOrderManagement'
import RestaurantBilling from './RestaurantBilling'
import RestaurantMenuManagement from './RestaurantMenuManagement'
import RestaurantStockManagement from './RestaurantStockManagement'
import RestaurantStaffManagement from './RestaurantStaffManagement'
import RestaurantTableManagement from './RestaurantTableManagement'
import ExpenseManagement from './ExpenseManagement'
import CustomerManagement from './CustomerManagement'
import StaffManagement from './StaffManagement'
import Search from './Search'
import Notifications from './Notifications'
import Profile from './Profile'
import About from './About'
import Contact from './Contact'
import Login from './Login'
import Signup from './Signup'
import NotFound from './NotFound'
import Legal from './Legal'
import AuthGuard from './AuthGuard'
import Styles from '../styles/TopNav.module.css'
import { getTheme, setTheme } from '../utils/theme'
import { getIsLoggedIn, getStoredUser, subscribeAuth } from '../utils/authEvents'
import { PiList, PiMonitor, PiMoon, PiSun } from 'react-icons/pi'

const getInitials = (name) => {
    if (!name) return 'BP';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'BP';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const TopNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);
    const [user, setUser] = useState(getStoredUser);
    const [themeMode, setThemeMode] = useState(() => getTheme());
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const refresh = () => {
            setIsLoggedIn(getIsLoggedIn());
            setUser(getStoredUser());
        };
        return subscribeAuth(refresh);
    }, []);

    useEffect(() => {
        const handleThemeChange = () => setThemeMode(getTheme());
        window.addEventListener('themeChanged', handleThemeChange);
        return () => window.removeEventListener('themeChanged', handleThemeChange);
    }, []);

    // Keep scroll reset on navigation; menu closing happens on link click
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [location.pathname]);

    const handleQuickThemeToggle = () => {
        const current = getTheme();
        const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
        setTheme(next);
    };

    const ThemeIcon = themeMode === 'light' ? PiSun : themeMode === 'dark' ? PiMoon : PiMonitor;
    const themeLabel = themeMode === 'light' ? 'Light' : themeMode === 'dark' ? 'Dark' : 'System';

    const navLinkClass = ({ isActive }) =>
        `${Styles.navLink} ${isActive ? Styles.active : ''}`;

    const closeMenu = () => setMenuOpen(false);

    const handleProtectedNavigation = (path) => {
        if (!isLoggedIn) {
            navigate('/Signup', { state: { notice: 'Create a free account to unlock the business workspace.' } });
        } else {
            navigate(path);
        }
    };

    return (
        <>
            <header className={`${Styles.topnav} ${isLoggedIn ? Styles.withSidebar : ''}`}>
                <Link to="/" className={Styles.brand}>
                    <span className={Styles.brandMark} aria-hidden="true">
                        <svg viewBox="0 0 64 64" width="20" height="20">
                            <path d="M10 38 L20 38 L26 18 L33 50 L39 30 L43 38 L54 38" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className={Styles.brandText}>BizPulse</span>
                </Link>

                <nav className={`${Styles.links} ${menuOpen ? Styles.open : ''}`} aria-label="Primary">
                    <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>Home</NavLink>
                    <NavLink to="/About" className={navLinkClass} onClick={closeMenu}>About</NavLink>
                    <NavLink to="/Contact" className={navLinkClass} onClick={closeMenu}>Contact</NavLink>
                    {!isLoggedIn && (
                        <div className={Styles.mobileAuth}>
                            <NavLink to="/Login" className={Styles.navLink} onClick={closeMenu}>Log in</NavLink>
                            <NavLink to="/Signup" className={Styles.ctaLink} onClick={closeMenu}>Create account</NavLink>
                        </div>
                    )}
                </nav>

                <div className={Styles.actions}>
                    <button
                        className={Styles.themeToggleBtn}
                        onClick={handleQuickThemeToggle}
                        title={`Theme: ${themeLabel} — click to switch`}
                        aria-label={`Switch theme (current: ${themeLabel})`}
                    >
                        <ThemeIcon aria-hidden="true" />
                    </button>

                    {isLoggedIn ? (
                        <Link to="/Profile" className={Styles.profileChip} title="Open profile">
                            <span className={Styles.profileAvatar} aria-hidden="true">
                                {getInitials(user?.name || user?.businessName)}
                            </span>
                            <span className={Styles.profileName}>{user?.name || 'Profile'}</span>
                        </Link>
                    ) : (
                        <div className={Styles.authActions}>
                            <Link to="/Login" className={Styles.ghostBtn}>Log in</Link>
                            <button
                                type="button"
                                className={Styles.solidBtn}
                                onClick={() => handleProtectedNavigation('/dashboard')}
                            >
                                Get started
                            </button>
                        </div>
                    )}

                    <button
                        className={Styles.menuBtn}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <PiX aria-hidden="true" /> : <PiList aria-hidden="true" />}
                    </button>
                </div>
            </header>

            <main id="main-content" className={Styles['nav-content']}>
            <Routes basename="/">
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={
                    <AuthGuard>
                        <BusinessDashboard />
                    </AuthGuard>
                } />
                <Route path="/restaurant-dashboard" element={
                    <AuthGuard>
                        <RestaurantDashboard />
                    </AuthGuard>
                } />
                <Route path="/retail-dashboard" element={
                    <AuthGuard>
                        <RetailDashboard />
                    </AuthGuard>
                } />
                <Route path="/service-dashboard" element={
                    <AuthGuard>
                        <ServiceDashboard />
                    </AuthGuard>
                } />
                <Route path="/sales-upload" element={
                    <AuthGuard>
                        <SalesUpload />
                    </AuthGuard>
                } />
                <Route path="/analytics" element={
                    <AuthGuard>
                        <Analytics />
                    </AuthGuard>
                } />
                <Route path="/stock" element={
                    <AuthGuard>
                        <StockManagement />
                    </AuthGuard>
                } />
                <Route path="/stock-management" element={
                    <AuthGuard>
                        <StockManagement />
                    </AuthGuard>
                } />
                <Route path="/fuel-sales" element={
                    <AuthGuard>
                        <FuelSales />
                    </AuthGuard>
                } />
                <Route path="/transactions" element={
                    <AuthGuard>
                        <Transactions />
                    </AuthGuard>
                } />
                <Route path="/reports" element={
                    <AuthGuard>
                        <Reports />
                    </AuthGuard>
                } />
                <Route path="/settings" element={
                    <AuthGuard>
                        <Settings />
                    </AuthGuard>
                } />
                <Route path="/order-management" element={
                    <AuthGuard>
                        <RestaurantOrderManagement />
                    </AuthGuard>
                } />
                <Route path="/restaurant-orders" element={
                    <AuthGuard>
                        <RestaurantOrderManagement />
                    </AuthGuard>
                } />
                <Route path="/billing" element={
                    <AuthGuard>
                        <RestaurantBilling />
                    </AuthGuard>
                } />
                <Route path="/restaurant-billing" element={
                    <AuthGuard>
                        <RestaurantBilling />
                    </AuthGuard>
                } />
                <Route path="/menu-management" element={
                    <AuthGuard>
                        <RestaurantMenuManagement />
                    </AuthGuard>
                } />
                <Route path="/tables" element={
                    <AuthGuard>
                        <RestaurantTableManagement />
                    </AuthGuard>
                } />
                <Route path="/staff" element={
                    <AuthGuard>
                        <RestaurantStaffManagement />
                    </AuthGuard>
                } />
                <Route path="/restaurant-staff" element={
                    <AuthGuard>
                        <RestaurantStaffManagement />
                    </AuthGuard>
                } />
                <Route path="/restaurant-stock" element={
                    <AuthGuard>
                        <RestaurantStockManagement />
                    </AuthGuard>
                } />
                <Route path="/expenses" element={
                    <AuthGuard>
                        <ExpenseManagement />
                    </AuthGuard>
                } />
                <Route path="/customers" element={
                    <AuthGuard>
                        <CustomerManagement />
                    </AuthGuard>
                } />
                <Route path="/staff-management" element={
                    <AuthGuard>
                        <StaffManagement />
                    </AuthGuard>
                } />
                <Route path="/Profile" element={
                    <AuthGuard>
                        <Profile />
                    </AuthGuard>
                } />
                <Route path="/profile" element={
                    <AuthGuard>
                        <Profile />
                    </AuthGuard>
                } />
                <Route path="/About" element={<About />} />
                <Route path="/about" element={<About />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/privacy" element={<Legal doc="privacy" />} />
                <Route path="/terms" element={<Legal doc="terms" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            </main>
        </>
    );
}
export default TopNav;
