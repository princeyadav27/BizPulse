import Styles from '../styles/Login.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import { getUserProfile } from '../services/firebaseService'
import { emitAuthChange } from '../utils/authEvents'
import { PiArrowRight, PiChartLine, PiEye, PiEyeSlash, PiGasPump, PiShieldCheck, PiStorefront } from 'react-icons/pi'

const getDashboardPath = (type) => {
    switch (type) {
        case 'restaurant': return '/restaurant-dashboard';
        case 'retail': return '/retail-dashboard';
        case 'service': return '/service-dashboard';
        default: return '/dashboard';
    }
};

const GoogleMark = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"/>
        <path fill="#FBBC05" d="M5.27 14.27A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.27V6.64H1.29a12 12 0 0 0 0 10.72l3.98-3.09z"/>
        <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.64l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z"/>
    </svg>
);

const MicrosoftMark = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022"/>
        <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00"/>
        <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetNotice, setResetNotice] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const notice = location.state?.notice || '';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (resetNotice) setResetNotice('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            const userProfile = await getUserProfile(user.uid);
            if (!userProfile) {
                throw new Error('User profile not found in database.');
            }

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
            emitAuthChange();

            clearUserData(user.uid);
            navigate(getDashboardPath(userData.businessType));
        } catch (err) {
            console.error('Login error:', err);
            let message = 'Login failed. Please try again.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                message = 'Incorrect email or password.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Enter a valid email address.';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many attempts. Wait a moment and try again.';
            } else if (err.message === 'User profile not found in database.') {
                message = 'This account has no profile. Please contact support.';
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setResetNotice('');
        setError('');
        if (!formData.email.trim()) {
            setError('Enter your email above, then choose Forgot password.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, formData.email.trim());
            setResetNotice('Reset link sent. Check your inbox for further instructions.');
        } catch (err) {
            console.error('Reset error:', err);
            setError(
                err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email'
                    ? 'No account found for that email address.'
                    : 'Could not send the reset link. Try again in a minute.'
            );
        }
    };

    const clearUserData = (userId) => {
        if (userId) {
            const keys = ['restaurantOrders', 'restaurantCustomers', 'restaurantStock', 'salesData', 'stockData'];
            keys.forEach(key => {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                const filteredData = data.filter(item => !item.userId || item.userId === userId);
                localStorage.setItem(key, JSON.stringify(filteredData));
            });
        }
    };

    const handleSocialLogin = (provider) => {
        const email = `user@${provider}.com`;
        const uniqueUserId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = existingUsers.find(u => u.email === email);

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
                name: `${provider === 'google' ? 'Google' : 'Microsoft'} User`,
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

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userData', JSON.stringify(userData));
        emitAuthChange();

        clearUserData(userData.id || userData.userId);
        navigate(getDashboardPath(userData.businessType));
    };

    return (
        <div className={Styles.login}>
            <div className={Styles.shell}>
                <aside className={Styles.brandPanel}>
                    <Link to="/" className={Styles.brandLockup}>
                        <span className={Styles.brandMark} aria-hidden="true">
                            <svg viewBox="0 0 64 64" width="22" height="22">
                                <path d="M10 38 L20 38 L26 18 L33 50 L39 30 L43 38 L54 38" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                        <span>BizPulse</span>
                    </Link>

                    <div className={Styles.brandBody}>
                        <h2 className={Styles.brandTitle}>Every rupee, every liter, every table — accounted for.</h2>
                        <p className={Styles.brandText}>
                            Sign in to pick up exactly where you left off. Your stock, staff and sales are waiting on the dashboard.
                        </p>
                    </div>

                    <ul className={Styles.proofList}>
                        <li>
                            <PiGasPump aria-hidden="true" />
                            <span>Fuel stations live-monitoring tank levels</span>
                        </li>
                        <li>
                            <PiStorefront aria-hidden="true" />
                            <span>Retail counters closing books in minutes</span>
                        </li>
                        <li>
                            <PiChartLine aria-hidden="true" />
                            <span>Reports that reconcile to the last unit</span>
                        </li>
                        <li>
                            <PiShieldCheck aria-hidden="true" />
                            <span>Data locked to your account, always</span>
                        </li>
                    </ul>
                </aside>

                <section className={Styles.formPanel}>
                    <div className={Styles.formCard}>
                        <header className={Styles.header}>
                            <h1 className={Styles.title}>Welcome back</h1>
                            <p className={Styles.subtitle}>Sign in to your BizPulse workspace</p>
                        </header>

                        {(notice || resetNotice) && (
                            <p className={Styles.notice} role="status">{resetNotice || notice}</p>
                        )}
                        {error && (
                            <p className={Styles.errorBanner} role="alert">{error}</p>
                        )}

                        <form className={Styles.form} onSubmit={handleSubmit} noValidate>
                            <div className={Styles.formGroup}>
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@business.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className={Styles.formGroup}>
                                <div className={Styles.labelRow}>
                                    <label htmlFor="password">Password</label>
                                    <button
                                        type="button"
                                        className={Styles.forgotPassword}
                                        onClick={handleForgotPassword}
                                    >
                                        Forgot password
                                    </button>
                                </div>
                                <div className={Styles.passwordWrap}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={Styles.eyeBtn}
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <PiEyeSlash aria-hidden="true" /> : <PiEye aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className={Styles.loginBtn} disabled={isLoading}>
                                {isLoading ? (
                                    <><span className={Styles.spinner} aria-hidden="true" /> Signing in</>
                                ) : (
                                    <>Sign in <PiArrowRight aria-hidden="true" /></>
                                )}
                            </button>
                        </form>

                        <div className={Styles.divider}>
                            <span>or continue with</span>
                        </div>

                        <div className={Styles.socialLogin}>
                            <button
                                type="button"
                                className={Styles.socialBtn}
                                onClick={() => handleSocialLogin('google')}
                            >
                                <GoogleMark />
                                Google
                            </button>
                            <button
                                type="button"
                                className={Styles.socialBtn}
                                onClick={() => handleSocialLogin('microsoft')}
                            >
                                <MicrosoftMark />
                                Microsoft
                            </button>
                        </div>

                        <p className={Styles.signup}>
                            New to BizPulse?{' '}
                            <Link to="/Signup" className={Styles.signupLink}>
                                Create a free account
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
