import { useNavigate } from 'react-router-dom'
import Styles from '../styles/About.module.css'

function About() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/dashboard');
        } else {
            navigate('/Signup');
        }
    };

    return (
        <div className={Styles.about}>
            <div className={Styles.container}>
                <div className={Styles.hero}>
                    <h1>About BizPulse</h1>
                    <p className={Styles.tagline}>Empowering All Businesses with Smart Management Solutions</p>
                </div>

                <div className={Styles.content}>
                    <section className={Styles.section}>
                        <div className={Styles.sectionIcon}>🎯</div>
                        <h2>Our Mission</h2>
                        <p>
                            To revolutionize petrol pump management by providing an intuitive, comprehensive, 
                            and data-driven platform that helps business owners make informed decisions, 
                            optimize operations, and maximize profitability.
                        </p>
                    </section>

                    <section className={Styles.section}>
                        <div className={Styles.sectionIcon}>💡</div>
                        <h2>What We Offer</h2>
                        <div className={Styles.features}>
                            <div className={Styles.feature}>
                                <h3>📊 Real-Time Analytics</h3>
                                <p>Track sales, monitor trends, and visualize your business performance with interactive graphs and insights.</p>
                            </div>
                            <div className={Styles.feature}>
                                <h3>🛢️ Stock Management</h3>
                                <p>Automated inventory tracking with low-stock alerts and purchase management for seamless operations.</p>
                            </div>
                            <div className={Styles.feature}>
                                <h3>📈 Sales Tracking</h3>
                                <p>Easy sales upload with automatic calculations and comprehensive transaction history.</p>
                            </div>
                            <div className={Styles.feature}>
                                <h3>📄 Smart Reports</h3>
                                <p>Generate detailed reports for sales, stock, and financial analysis to support business decisions.</p>
                            </div>
                        </div>
                    </section>

                    <section className={Styles.section}>
                        <div className={Styles.sectionIcon}>🚀</div>
                        <h2>Why Choose Us</h2>
                        <ul className={Styles.benefits}>
                            <li>✅ User-friendly interface designed for petrol pump owners</li>
                            <li>✅ Real-time data synchronization across all modules</li>
                            <li>✅ Automated stock deduction based on sales</li>
                            <li>✅ Comprehensive analytics with actionable insights</li>
                            <li>✅ Secure data storage and management</li>
                            <li>✅ Mobile-responsive design for on-the-go access</li>
                        </ul>
                    </section>

                    <section className={Styles.section}>
                        <div className={Styles.sectionIcon}>👥</div>
                        <h2>Who We Serve</h2>
                        <p>
                            BizPulse is designed for business owners, managers, and operators who want to
                            streamline their daily operations, reduce manual work, and gain better visibility
                            into their business performance. Whether you run a petrol pump, restaurant, retail
                            store, or service center, our platform scales with your needs.
                        </p>
                    </section>

                    <section className={Styles.section}>
                        <div className={Styles.sectionIcon}>🌟</div>
                        <h2>Our Vision</h2>
                        <p>
                            To become the leading management information system for petrol pumps across India, 
                            helping thousands of businesses operate more efficiently and profitably through 
                            technology-driven solutions.
                        </p>
                    </section>
                </div>

                <div className={Styles.cta}>
                    <h2>Ready to Transform Your Business?</h2>
                    <p>Join hundreds of business owners who trust BizPulse for their daily operations</p>
                    <button className={Styles.ctaButton} onClick={handleGetStarted}>Get Started Today</button>
                </div>
            </div>
        </div>
    );
} 
export default About;