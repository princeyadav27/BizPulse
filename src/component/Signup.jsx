import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/Signup.module.css'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { createUserProfile } from '../services/firebaseService'

const Signup = () => {
    const navigate = useNavigate();
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

    const businessTypes = [
        { value: 'petrol-pump', label: 'Petrol Pump', icon: '⛽' },
        { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
        { value: 'retail', label: 'Retail Store', icon: '🏪' },
        { value: 'service', label: 'Service Center', icon: '🔧' },
        { value: 'multi-business', label: 'Multi-Business', icon: '🏢' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
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
                .replace('gmail.comm', 'gmail.com')  // Fix extra 'm'
                .replace('gmail.comm', 'gmail.com'); // Fix extra 'm'
            
            if (correctedEmail !== formData.email.toLowerCase()) {
                console.log('Email auto-corrected from:', formData.email, 'to:', correctedEmail);
                setFormData(prev => ({ ...prev, email: correctedEmail }));
            }
        }
        
        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            
            const user = userCredential.user;
            
            // 2. Save user profile in Firestore
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
            
            // 3. Store locally for immediate app use
            const userData = {
                id: user.uid,
                userId: user.uid,
                ...savedProfile
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', formData.email);
            
            console.log('Signup - Stored userData:', userData);
            
            // Clear any existing data for fresh start
            clearAllDataForNewUser(user.uid);
            
            // Redirect to dashboard
            const getDashboardPath = (type) => {
                switch (type) {
                    case 'restaurant': return '/restaurant-dashboard';
                    case 'retail': return '/retail-dashboard';
                    case 'service': return '/service-dashboard';
                    default: return '/dashboard';
                }
            };
            navigate(getDashboardPath(formData.businessType));
        } catch (error) {
            console.error('Signup error:', error);
            let message = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                message = 'This email is already registered.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password is too weak.';
            } else if (error.message) {
                message = error.message;
            }
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearAllDataForNewUser = (userId) => {
        // Clear all localStorage data for fresh start for new user
        const keysToClear = [
            'restaurantOrders', 
            'restaurantCustomers', 
            'restaurantStock', 
            'restaurantTables',
            'restaurantMenu',
            'salesData', 
            'stockData', 
            'stockTransactions',
            'businessSettings'
        ];
        
        keysToClear.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Initialize empty data arrays for new user
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

    const handleLoginRedirect = () => {
        navigate('/Login');
    };

    return (
        <div className={Styles.signup}>
            <div className={Styles.signupContainer}>
                <div className={Styles.signupCard}>
                    <div className={Styles.header}>
                        <h1 className={Styles.title}>Create Account</h1>
                        <p className={Styles.subtitle}>Join BizPulse and manage your business efficiently</p>
                    </div>
                    
                    <form className={Styles.form} onSubmit={handleSubmit}>
                        <div className={Styles.formRow}>
                            <div className={Styles.formGroup}>
                                <label htmlFor="firstName">First Name</label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    name="firstName" 
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={errors.firstName ? Styles.error : ''}
                                />
                                {errors.firstName && <span className={Styles.errorText}>{errors.firstName}</span>}
                            </div>
                            
                            <div className={Styles.formGroup}>
                                <label htmlFor="lastName">Last Name</label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    name="lastName" 
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={errors.lastName ? Styles.error : ''}
                                />
                                {errors.lastName && <span className={Styles.errorText}>{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className={Styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? Styles.error : ''}
                            />
                            {errors.email && <span className={Styles.errorText}>{errors.email}</span>}
                        </div>

                        <div className={Styles.formGroup}>
                            <label htmlFor="phone">Phone Number</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={errors.phone ? Styles.error : ''}
                            />
                            {errors.phone && <span className={Styles.errorText}>{errors.phone}</span>}
                        </div>

                        <div className={Styles.formGroup}>
                            <label htmlFor="businessName">Business Name</label>
                            <input 
                                type="text" 
                                id="businessName" 
                                name="businessName" 
                                placeholder="Enter business name"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className={errors.businessName ? Styles.error : ''}
                            />
                            {errors.businessName && <span className={Styles.errorText}>{errors.businessName}</span>}
                        </div>

                        <div className={Styles.formGroup}>
                            <label htmlFor="businessType">Business Type</label>
                            <select
                                id="businessType"
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                className={errors.businessType ? Styles.error : ''}
                            >
                                {businessTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.businessType && <span className={Styles.errorText}>{errors.businessType}</span>}
                        </div>

                        <div className={Styles.formRow}>
                            <div className={Styles.formGroup}>
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? Styles.error : ''}
                                />
                                {errors.password && <span className={Styles.errorText}>{errors.password}</span>}
                            </div>
                            
                            <div className={Styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
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
                                <span className={Styles.checkmark}></span>
                                I agree to the Terms of Service and Privacy Policy
                            </label>
                            {errors.agreeTerms && <span className={Styles.errorText}>{errors.agreeTerms}</span>}
                        </div>
                        
                        <button type="submit" className={Styles.signupBtn} disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        
                        <div className={Styles.divider}>
                            <span>OR</span>
                        </div>
                        
                        <div className={Styles.socialLogin}>
                            <button type="button" className={Styles.socialBtn}>
                                <span className={Styles.googleIcon}>G</span>
                                Sign up with Google
                            </button>
                            <button type="button" className={Styles.socialBtn}>
                                <span className={Styles.microsoftIcon}>M</span>
                                Sign up with Microsoft
                            </button>
                        </div>
                        
                        <p className={Styles.login}>
                            Already have an account? 
                            <button type="button" onClick={handleLoginRedirect} className={Styles.loginLink}>
                                Login
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
