import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
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
import AuthGuard from './AuthGuard'
import Styles from '../styles/TopNav.module.css'
import { getTheme, setTheme } from '../utils/theme'

const TopNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [themeMode, setThemeMode] = useState('system');

    useEffect(() => {
        setThemeMode(getTheme());
        const handleThemeChange = () => {
            setThemeMode(getTheme());
        };
        window.addEventListener('themeChanged', handleThemeChange);
        return () => window.removeEventListener('themeChanged', handleThemeChange);
    }, []);

    const handleQuickThemeToggle = () => {
        const current = getTheme();
        let next = 'light';
        if (current === 'light') {
            next = 'dark';
        } else if (current === 'dark') {
            next = 'system';
        }
        setTheme(next);
    };

    useEffect(() => {
        const loginStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loginStatus === 'true');
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const loginStatus = localStorage.getItem('isLoggedIn');
            setIsLoggedIn(loginStatus === 'true');
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically for same-tab updates
        const interval = setInterval(() => {
            const loginStatus = localStorage.getItem('isLoggedIn');
            setIsLoggedIn(loginStatus === 'true');
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleProtectedNavigation = (path) => {
        if (!isLoggedIn) {
            alert('Please create an account or login to access this page.');
            navigate('/Signup');
        } else {
            navigate(path);
        }
    };

    return (
        <>
            <div className={Styles.topnav}>
                <Link to="/">Home</Link>
                <Link to="/About">About</Link>
                <Link to="/Contact">Contact</Link>
                {isLoggedIn ? (
                    <Link to="/Profile">Profile</Link>
                ) : (
                    <>
                        <Link to="/Login">Login</Link>
                        <Link to="/Signup">Sign Up</Link>
                    </>
                )}
                <button 
                    className={Styles.themeToggleBtn} 
                    onClick={handleQuickThemeToggle}
                    title={`Theme: ${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} (Click to switch)`}
                    aria-label="Toggle App Theme"
                >
                    {themeMode === 'light' && '☀️'}
                    {themeMode === 'dark' && '🌙'}
                    {themeMode === 'system' && '⚙️'}
                </button>
            </div>
            <div className={Styles['nav-content']}>
            <Routes>
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
                <Route path="/About" element={<About />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
            </Routes>
            </div>
        </>
    );
}
export default TopNav;