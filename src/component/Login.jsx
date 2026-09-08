import Styles from '../styles/Login.module.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { getUserProfile } from '../services/firebaseService'

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // 1. Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            
            const user = userCredential.user;
            
            // 2. Get user profile from Firestore
            const userProfile = await getUserProfile(user.uid);
            if (!userProfile) {
                throw new Error('User profile not found in database.');
            }
            
            // 3. Store locally for app use
            const userData = {
                id: user.uid,
                userId: user.uid,
                email: user.email,
                ...userProfile,
                lastLogin: new Date().toLocaleString()
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', formData.email);
            
            console.log('Login - Stored userData:', userData);
            
            // Clear any old data to ensure fresh start
            clearUserData(user.uid);
            
            // Redirect to dashboard
            const getDashboardPath = (type) => {
                switch (type) {
                    case 'restaurant': return '/restaurant-dashboard';
                    case 'retail': return '/retail-dashboard';
                    case 'service': return '/service-dashboard';
                    default: return '/dashboard';
                }
            };
            navigate(getDashboardPath(userData.businessType));
        } catch (error) {
            console.error('Login error:', error);
            let message = 'Login failed. Please check your credentials.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = 'Incorrect email or password.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (error.message) {
                message = error.message;
            }
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearUserData = (userId) => {
        // Clear all user-specific data for fresh start
        if (userId) {
            console.log('Login - Clearing data for userId:', userId);
            
            // Keep existing data but ensure it's filtered by user ID
            const keys = ['restaurantOrders', 'restaurantCustomers', 'restaurantStock', 'salesData', 'stockData'];
            keys.forEach(key => {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                console.log(`Login - ${key} before filtering:`, data);
                
                // Filter data to ensure only this user's data remains
                const filteredData = data.filter(item => {
                    // Keep items with no userId OR items that belong to current user
                    return !item.userId || item.userId === userId;
                });
                console.log(`Login - ${key} after filtering:`, filteredData);
                
                localStorage.setItem(key, JSON.stringify(filteredData));
            });
        }
    };

    const handleSocialLogin = (provider) => {
        // Simulate social login with proper user creation
        const email = `user@${provider}.com`;
        const uniqueUserId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = existingUsers.find(user => user.email === email);
        
        let userData;
        if (existingUser) {
            userData = {
                ...existingUser,
                lastLogin: new Date().toLocaleString()
            };
        } else {
            userData = {
                id: uniqueUserId,
                userId: uniqueUserId,
                name: `${provider} User`,
                email: email,
                businessName: 'My Business',
                businessType: 'petrol-pump',
                role: 'Business Owner',
                joinDate: new Date().toISOString().split('T')[0],
                lastLogin: new Date().toLocaleString()
            };
            
            existingUsers.push(userData);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        }
        
        // Store login status and user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Clear any old data
        clearUserData(userData.id || userData.userId);
        
        const getDashboardPath = (type) => {
            switch (type) {
                case 'restaurant': return '/restaurant-dashboard';
                case 'retail': return '/retail-dashboard';
                case 'service': return '/service-dashboard';
                default: return '/dashboard';
            }
        };
        navigate(getDashboardPath(userData.businessType));
    };

    return (
        <div className={Styles.login}>
            <div className={Styles.loginContainer}>
                <div className={Styles.loginCard}>
                    <h1 className={Styles.title}>Login</h1>
                    <p className={Styles.subtitle}>Welcome back to BizPulse</p>
                    
                    <form className={Styles.form} onSubmit={handleSubmit}>
                        <div className={Styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        
                        <div className={Styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        
                        <div className={Styles.formOptions}>
                            <label className={Styles.checkbox}>
                                <input type="checkbox" name="remember" />
                                <span className={Styles.checkmark}></span>
                                Remember me
                            </label>
                            <a href="#" className={Styles.forgotPassword}>Forgot Password?</a>
                        </div>
                        
                        <button type="submit" className={Styles.loginBtn} disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        
                        <div className={Styles.divider}>
                            <span>OR</span>
                        </div>
                        
                        <div className={Styles.socialLogin}>
                            <button 
                                type="button" 
                                className={Styles.socialBtn}
                                onClick={() => handleSocialLogin('google')}
                            >
                                <span className={Styles.googleIcon}>G</span>
                                Login with Google
                            </button>
                            <button 
                                type="button" 
                                className={Styles.socialBtn}
                                onClick={() => handleSocialLogin('microsoft')}
                            >
                                <span className={Styles.microsoftIcon}>M</span>
                                Login with Microsoft
                            </button>
                        </div>
                        
                        <p className={Styles.signup}>
                            Don't have an account? 
                            <button type="button" onClick={() => navigate('/Signup')} className={Styles.signupLink}>
                                Sign up
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
