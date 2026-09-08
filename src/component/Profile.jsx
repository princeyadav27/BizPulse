import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/Profile.module.css'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        businessName: '',
        businessType: '',
        joinDate: '',
        lastLogin: ''
    });
    
    const [allBusinesses, setAllBusinesses] = useState([]);

    useEffect(() => {
        // Get user data from localStorage
        const userEmail = localStorage.getItem('userEmail');
        const userData = localStorage.getItem('userData');
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        if (userData) {
            const parsedData = JSON.parse(userData);
            // Map userData to profile format
            const profileData = {
                name: parsedData.name || (userEmail ? userEmail.split('@')[0] : 'User'),
                email: parsedData.email || userEmail || 'user@example.com',
                phone: parsedData.phone || '+91 98765 43210',
                role: parsedData.role || 'Business Owner',
                businessName: parsedData.businessName || 'My Business',
                businessType: parsedData.businessType || 'petrol-pump',
                joinDate: parsedData.joinDate || new Date().toISOString().split('T')[0],
                lastLogin: parsedData.lastLogin || new Date().toLocaleString()
            };
            setUser(profileData);
            
            // Get all businesses for this user
            const userBusinesses = registeredUsers.filter(user => user.email === userEmail);
            console.log('Profile - User Businesses:', userBusinesses);
            
            // Create unique business types with names
            const businessTypes = {};
            userBusinesses.forEach(business => {
                const type = business.businessType || 'petrol-pump';
                if (!businessTypes[type]) {
                    businessTypes[type] = {
                        type: type,
                        name: business.businessName || business.pumpName || business.restaurantName || business.retailName || business.serviceName || 'My Business',
                        icon: type === 'petrol-pump' ? '⛽' : 
                              type === 'restaurant' ? '🍽️' :
                              type === 'retail' ? '🏪' :
                              type === 'service' ? '🔧' : '🏢',
                        displayName: type.replace('-', ' ').toUpperCase()
                    };
                }
            });
            
            const allBusinesses = Object.values(businessTypes);
            console.log('Profile - All Business Types:', allBusinesses);
            setAllBusinesses(allBusinesses);
        } else {
            // Set default user data for demo
            const defaultUser = {
                name: userEmail ? userEmail.split('@')[0] : 'John Doe',
                email: userEmail || 'john.doe@example.com',
                phone: '+91 98765 43210',
                role: 'Business Manager',
                businessName: 'My Business',
                businessType: 'petrol-pump',
                joinDate: '2024-01-15',
                lastLogin: new Date().toLocaleString()
            };
            setUser(defaultUser);
            localStorage.setItem('userData', JSON.stringify(defaultUser));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userData');
            navigate('/Login');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed: ' + error.message);
        }
    };

    const handleEditProfile = () => {
        // Navigate to edit profile or open modal
        alert('Edit Profile functionality coming soon!');
    };
    
    const handleBusinessAccess = (businessType) => {
        console.log('Profile - Navigating to business:', businessType);
        
        // Update current user data to selected business type
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = {
            ...userData,
            businessType: businessType
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Navigate to appropriate dashboard
        let navigationPath;
        switch(businessType) {
            case 'restaurant':
                navigationPath = '/restaurant-dashboard';
                break;
            case 'retail':
                navigationPath = '/retail-dashboard';
                break;
            case 'service':
                navigationPath = '/service-dashboard';
                break;
            case 'petrol-pump':
            default:
                navigationPath = '/dashboard';
                break;
        }
        
        console.log('Profile - Navigation path:', navigationPath);
        navigate(navigationPath);
    };

    return (
        <div className={Styles.profile}>
            <div className={Styles.container}>
                <div className={Styles.profileHeader}>
                    <div className={Styles.profileCard}>
                        <div className={Styles.avatar}>
                            <img 
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff&size=128`}
                                alt="Profile" 
                                className={Styles.avatarImg}
                            />
                        </div>
                        <div className={Styles.profileInfo}>
                            <h1 className={Styles.name}>{user.name}</h1>
                            <p className={Styles.email}>{user.email}</p>
                            <p className={Styles.role}>{user.role}</p>
                            <div className={Styles.actions}>
                                <button 
                                    className={Styles.editBtn}
                                    onClick={handleEditProfile}
                                >
                                    Edit Profile
                                </button>
                                <button 
                                    className={Styles.logoutBtn}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.profileDetails}>
                    <div className={Styles.detailSection}>
                        <h2>Personal Information</h2>
                        <div className={Styles.detailGrid}>
                            <div className={Styles.detailItem}>
                                <label>Full Name</label>
                                <span>{user.name}</span>
                            </div>
                            <div className={Styles.detailItem}>
                                <label>Email Address</label>
                                <span>{user.email}</span>
                            </div>
                            <div className={Styles.detailItem}>
                                <label>Phone Number</label>
                                <span>{user.phone}</span>
                            </div>
                            <div className={Styles.detailItem}>
                                <label>Role</label>
                                <span>{user.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className={Styles.detailSection}>
                        <h2>Business Information</h2>
                        <div className={Styles.detailGrid}>
                            <div className={Styles.detailItem}>
                                <label>Business Name</label>
                                <span>{user.businessName}</span>
                            </div>
                            <div className={Styles.detailItem}>
                                <label>Business Type</label>
                                <span>{user.businessType?.replace('-', ' ').toUpperCase() || 'PETROL PUMP'}</span>
                            </div>
                            <div className={Styles.detailItem}>
                                <label>Member Since</label>
                                <span>{user.joinDate}</span>
                            </div>
                            <div className={Styles.detailItem}>
                                <label>Last Login</label>
                                <span>{user.lastLogin}</span>
                            </div>
                        </div>
                    </div>

                    <div className={Styles.detailSection}>
                        <h2>Business Access</h2>
                        <div className={Styles.businessAccess}>
                            {allBusinesses.map((business, index) => (
                                <div 
                                    key={index}
                                    className={Styles.accessItem}
                                    onClick={() => handleBusinessAccess(business.type)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={Styles.accessIcon}>
                                        {business.icon}
                                    </div>
                                    <div className={Styles.accessInfo}>
                                        <h3>{business.name}</h3>
                                        <p>{business.displayName} - Full Access</p>
                                    </div>
                                    <div className={Styles.accessArrow}>
                                        →
                                    </div>
                                </div>
                            ))}
                            
                            {allBusinesses.length === 0 && (
                                <div className={Styles.accessItem}>
                                    <div className={Styles.accessIcon}>🏢</div>
                                    <div className={Styles.accessInfo}>
                                        <h3>{user.businessName || 'My Business'}</h3>
                                        <p>{user.businessType?.replace('-', ' ').toUpperCase() || 'PETROL PUMP'} - Full Access</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;