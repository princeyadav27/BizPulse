import Styles from '../styles/Contact.module.css'

const Contact = () => {
    return (
        <div className={Styles.contact}>
            <div className={Styles.container}>
                <h1 className={Styles.title}>Contact Us</h1>
                <p className={Styles.subtitle}>Get in touch with our team</p>
                
                <div className={Styles.contactGrid}>
                    <div className={Styles.contactInfo}>
                        <h2>Get in Touch</h2>
                        <div className={Styles.infoItem}>
                            <h3>📍 Address</h3>
                            <p>123 Business Street<br />City, State 12345</p>
                        </div>
                        <div className={Styles.infoItem}>
                            <h3>📞 Phone</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                        <div className={Styles.infoItem}>
                            <h3>📧 Email</h3>
                            <p>info@bizpulse.com</p>
                        </div>
                        <div className={Styles.infoItem}>
                            <h3>🕐 Business Hours</h3>
                            <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                        </div>
                    </div>
                    
                    <div className={Styles.contactForm}>
                        <h2>Send us a Message</h2>
                        <form className={Styles.form}>
                            <div className={Styles.formGroup}>
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" name="name" required />
                            </div>
                            <div className={Styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" required />
                            </div>
                            <div className={Styles.formGroup}>
                                <label htmlFor="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" />
                            </div>
                            <div className={Styles.formGroup}>
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" name="subject" required />
                            </div>
                            <div className={Styles.formGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit" className={Styles.submitBtn}>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
