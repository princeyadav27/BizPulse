import Styles from '../styles/Home.module.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/Login');
    };

    const handleLearnMore = () => {
        navigate('/About');
    };

    const handleProtectedNavigation = (path, message) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            alert(message);
            navigate('/Signup');
        } else {
            navigate(path);
        }
    };

    return (
        <div className={Styles.home}>
            <div className={Styles.hero}>
                <div className={Styles.heroContent}>
                    <h1 className={Styles.title}>Welcome to BizPulse</h1>
                    <p className={Styles.subtitle}>Complete Business Management Solution</p>
                    <p className={Styles.description}>
                        Manage petrol pump, restaurant, retail store, and service center - all in one powerful system. 
                        Track sales, inventory, customers, and grow your business with our comprehensive management platform.
                    </p>
                    <div className={Styles.buttons}>
                        <button className={Styles.primaryBtn} onClick={handleGetStarted}>Get Started</button>
                        <button className={Styles.secondaryBtn} onClick={handleLearnMore}>Learn More</button>
                    </div>
                </div>
            </div>
            
            <div className={Styles.features}>
                <div className={Styles.container}>
                    <h2 className={Styles.sectionTitle}>Why Choose BizPulse?</h2>
                    <div className={Styles.featureGrid}>
                        <div className={Styles.featureCard}>
                            <div className={Styles.icon}>⛽</div>
                            <h3>Petrol Pump Management</h3>
                            <p>Track fuel sales, stock levels, vapor recovery, and pump efficiency in real-time.</p>
                            <button 
                                className={Styles.featureBtn}
                                onClick={() => handleProtectedNavigation('/dashboard', 'Please signup to access Petrol Pump Management')}
                            >
                                Explore Features
                            </button>
                        </div>
                        <div className={Styles.featureCard}>
                            <div className={Styles.icon}>🍽️</div>
                            <h3>Restaurant Operations</h3>
                            <p>Manage orders, inventory, table bookings, and restaurant staff efficiently.</p>
                            <button 
                                className={Styles.featureBtn}
                                onClick={() => handleProtectedNavigation('/dashboard', 'Please signup to access Restaurant Operations')}
                            >
                                Explore Features
                            </button>
                        </div>
                        <div className={Styles.featureCard}>
                            <div className={Styles.icon}>🏪</div>
                            <h3>Retail Store Control</h3>
                            <p>Handle sales, stock management, customer data, and retail analytics.</p>
                            <button 
                                className={Styles.featureBtn}
                                onClick={() => handleProtectedNavigation('/dashboard', 'Please signup to access Retail Store Control')}
                            >
                                Explore Features
                            </button>
                        </div>
                        <div className={Styles.featureCard}>
                            <div className={Styles.icon}>🔧</div>
                            <h3>Service Center</h3>
                            <p>Manage service appointments, parts inventory, and customer vehicle history.</p>
                            <button 
                                className={Styles.featureBtn}
                                onClick={() => handleProtectedNavigation('/dashboard', 'Please signup to access Service Center')}
                            >
                                Explore Features
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={Styles.cta}>
                <div className={Styles.container}>
                    <h2>Ready to Transform Your Business?</h2>
                    <p>Join thousands of businesses using BizPulse to manage multiple operations efficiently.</p>
                    <button className={Styles.ctaBtn} onClick={handleGetStarted}>Start Free Trial</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
