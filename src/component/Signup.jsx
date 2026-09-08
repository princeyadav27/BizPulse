import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Styles from '../styles/Signup.module.css'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { createUserProfile } from '../services/firebaseService'
import { emitAuthChange } from '../utils/authEvents'
import { PiArrowRight, PiBuildings, PiCheck, PiEye, PiEyeSlash, PiForkKnife, PiGasPump, PiStorefront, PiWrench } from 'react-icons/pi'

const getDashboardPath = (type) => {
    switch (type) {
        case 'restaurant': return '/restaurant-dashboard';
        case 'retail': return '/retail-dashboard';
        case 'service': return '/service-dashboard';
        default: return '/dashboard';
    }
};

const BUSINESS_TYPES = [
    { value: 'petrol-pump', label: 'Petrol Pump', hint: 'Fuel sales and tank stock', Icon: PiGasPump },
    { value: 'restaurant', label: 'Restaurant', hint: 'Orders, billing and kitchen', Icon: PiForkKnife },
    { value: 'retail', label: 'Retail Store', hint: 'Counter sales and inventory', Icon: PiStorefront },
    { value: 'service', label: 'Service Center', hint: 'Jobs, parts and history', Icon: PiWrench },
    { value: 'multi-business', label: 'Multi-Business', hint: 'Several lines, one login', Icon: PiBuildings }
];

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        businessType: 'petrol-pump',
        agreeTerms: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [topError, setTopError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const notice = location.state?.notice || '';

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (topError) setTopError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Use at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        // Auto-correct common email typos
        if (formData.email) {
            const correctedEmail = formData.email
                .toLowerCase()
                .replace('gamil.com', 'gmail.com')
                .replace('gamil.co.in', 'gmail.co.in')
                .replace('gmail.co', 'gmail.com')
                .replace('gmial.com', 'gmail.com')
                .replace('gmaill.com', 'gmail.com')
                .replace('gmail.comm', 'gmail.com');

            if (correctedEmail !== formData.email.toLowerCase()) {
                setFormData(prev => ({ ...prev, email: correctedEmail }));
            }
        }

        if (!formData.agreeTerms) newErrors.agreeTerms = 'Agree to the terms to continue';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setTopError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            const userProfile = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                businessName: formData.businessName,
                businessType: formData.businessType,
                role: 'Business Owner',
                joinDate: new Date().toISOString().split('T')[0],
                lastLogin: new Date().toLocaleString()
            };

            const savedProfile = await createUserProfile(user.uid, userProfile);

            const userData = {
                id: user.uid,
                userId: user.uid,
                ...savedProfile
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', formData.email);
            emitAuthChange();

            clearAllDataForNewUser(user.uid);
            navigate(getDashboardPath(formData.businessType));
        } catch (error) {
            console.error('Signup error:', error);
            let message = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                message = 'This email is already registered. Try signing in instead.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Enter a valid email address.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Choose a stronger password.';
            } else if (error.code === 'auth/network-request-failed') {
                message = 'Connection failed. Check your network and try again.';
            }
            setTopError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearAllDataForNewUser = () => {
        const initialData = {
            'restaurantOrders': [],
            'restaurantCustomers': [],
            'restaurantStock': [],
            'restaurantTables': [],
            'restaurantMenu': [],
            'salesData': [],
            'stockData': [],
            'stockTransactions': [],
            'businessSettings': {}
        };

        Object.keys(initialData).forEach(key => {
            localStorage.setItem(key, JSON.stringify(initialData[key]));
        });
    };

    const selectedType = BUSINESS_TYPES.find(t => t.value === formData.businessType) || BUSINESS_TYPES[0];

    return (
        <div className={Styles.signup}>
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
                        <h2 className={Styles.brandTitle}>Set up your workspace in under two minutes.</h2>
                        <p className={Styles.brandText}>
                            Pick your business type and BizPulse shapes the dashboard, menus and reports around it. No cards, no calls — start tracking tonight.
                        </p>
                    </div>

                    <div className={Styles.selectedCard}>
                        <span className={Styles.selectedIcon} aria-hidden="true">
                            <selectedType.Icon />
                        </span>
                        <span className={Styles.selectedMeta}>
                            <span className={Styles.selectedLabel}>You picked</span>
                            <span className={Styles.selectedName}>{selectedType.label}</span>
                            <span className={Styles.selectedHint}>{selectedType.hint}</span>
                        </span>
                    </div>
                </aside>

                <section className={Styles.formPanel}>
                    <div className={Styles.formCard}>
                        <header className={Styles.header}>
                            <h1 className={Styles.title}>Create your account</h1>
                            <p className={Styles.subtitle}>One workspace for sales, stock, staff and reports</p>
                        </header>

                        {notice && (
                            <p className={Styles.notice} role="status">{notice}</p>
                        )}
                        {topError && (
                            <p className={Styles.errorBanner} role="alert">{topError}</p>
                        )}

                        <form className={Styles.form} onSubmit={handleSubmit} noValidate>
                            <fieldset className={Styles.typeFieldset}>
                                <legend className={Styles.typeLegend}>What are you running?</legend>
                                <div className={Styles.typeGrid} role="radiogroup" aria-label="Business type">
                                    {BUSINESS_TYPES.map(type => {
                                        const active = formData.businessType === type.value;
                                        return (
                                            <label
                                                key={type.value}
                                                className={`${Styles.typeCard} ${active ? Styles.typeCardActive : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="businessType"
                                                    value={type.value}
                                                    checked={active}
                                                    onChange={handleInputChange}
                                                    className={Styles.typeInput}
                                                />
                                                <span className={Styles.typeCheck} aria-hidden="true">
                                                    <PiCheck />
                                                </span>
                                                <type.Icon className={Styles.typeIcon} aria-hidden="true" />
                                                <span className={Styles.typeLabel}>{type.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="firstName">First name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Priya"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        autoComplete="given-name"
                                        className={errors.firstName ? Styles.error : ''}
                                    />
                                    {errors.firstName && <span className={Styles.errorText}>{errors.firstName}</span>}
                                </div>

                                <div className={Styles.formGroup}>
                                    <label htmlFor="lastName">Last name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Desai"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className={errors.lastName ? Styles.error : ''}
                                    />
                                    {errors.lastName && <span className={Styles.errorText}>{errors.lastName}</span>}
                                </div>
                            </div>

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
                                    className={errors.email ? Styles.error : ''}
                                />
                                {errors.email && <span className={Styles.errorText}>{errors.email}</span>}
                            </div>

                            <div className={Styles.formGroup}>
                                <label htmlFor="phone">Phone number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    autoComplete="tel"
                                    className={errors.phone ? Styles.error : ''}
                                />
                                {errors.phone && <span className={Styles.errorText}>{errors.phone}</span>}
                            </div>

                            <div className={Styles.formGroup}>
                                <label htmlFor="businessName">Business name</label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    placeholder="Green Valley Fuels"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    autoComplete="organization"
                                    className={errors.businessName ? Styles.error : ''}
                                />
                                {errors.businessName && <span className={Styles.errorText}>{errors.businessName}</span>}
                            </div>

                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="password">Password</label>
                                    <div className={Styles.passwordWrap}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            placeholder="At least 6 characters"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            autoComplete="new-password"
                                            className={errors.password ? Styles.error : ''}
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
                                    {errors.password && <span className={Styles.errorText}>{errors.password}</span>}
                                </div>

                                <div className={Styles.formGroup}>
                                    <label htmlFor="confirmPassword">Confirm password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Repeat it once"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        autoComplete="new-password"
                                        className={errors.confirmPassword ? Styles.error : ''}
                                    />
                                    {errors.confirmPassword && <span className={Styles.errorText}>{errors.confirmPassword}</span>}
                                </div>
                            </div>

                            <div className={Styles.checkboxGroup}>
                                <label className={Styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleInputChange}
                                    />
                                    <span>
                                        I agree to the{' '}
                                        <Link to="/terms" className={Styles.inlineLink}>Terms of service</Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" className={Styles.inlineLink}>Privacy policy</Link>
                                    </span>
                                </label>
                                {errors.agreeTerms && <span className={Styles.errorText}>{errors.agreeTerms}</span>}
                            </div>

                            <button type="submit" className={Styles.signupBtn} disabled={isLoading}>
                                {isLoading ? (
                                    <><span className={Styles.spinner} aria-hidden="true" /> Creating workspace</>
                                ) : (
                                    <>Create workspace <PiArrowRight aria-hidden="true" /></>
                                )}
                            </button>
                        </form>

                        <p className={Styles.login}>
                            Already have an account?{' '}
                            <Link to="/Login" className={Styles.loginLink}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Signup;
