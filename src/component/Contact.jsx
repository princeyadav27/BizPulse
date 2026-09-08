import { useState } from 'react'
import Styles from '../styles/Contact.module.css'
import { PiCheckCircle, PiClock, PiEnvelopeSimple, PiMapPin, PiPaperPlaneTilt, PiPhone } from 'react-icons/pi'

const INFO_ITEMS = [
    {
        Icon: PiMapPin,
        title: 'Office',
        lines: ['4th Floor, Aurora Trade Hub', 'Sayajigunj, Vadodara, Gujarat 390005']
    },
    {
        Icon: PiPhone,
        title: 'Phone',
        lines: ['+91 265 248 1702']
    },
    {
        Icon: PiEnvelopeSimple,
        title: 'Email',
        lines: ['support@bizpulse.in']
    },
    {
        Icon: PiClock,
        title: 'Support hours',
        lines: ['Monday – Saturday, 9:00 AM – 7:00 PM IST', 'Response within one business day']
    }
];

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        if (!formData.name.trim() || !formData.subject.trim() || !formData.message.trim()) {
            setError('Fill in your name, a subject and a message before sending.');
            return;
        }
        if (!emailOk) {
            setError('Enter a valid email address so we can reply.');
            return;
        }
        setSubmitted(true);
    };

    const handleReset = () => {
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setSubmitted(false);
        setError('');
    };

    return (
        <div className={Styles.contact}>
            <header className={Styles.hero}>
                <div className={Styles.container}>
                    <p className={Styles.kicker}>Contact</p>
                    <h1 className={Styles.title}>Talk to a human who knows the product.</h1>
                    <p className={Styles.subtitle}>
                        Setup questions, plan details or a walkthrough for your staff — send it over
                        and we reply within one business day.
                    </p>
                </div>
            </header>

            <div className={Styles.container}>
                <div className={Styles.contactGrid}>
                    <aside className={Styles.contactInfo}>
                        {INFO_ITEMS.map((item, i) => (
                            <div key={item.title} className={Styles.infoItem} style={{ animationDelay: `${i * 70}ms` }}>
                                <span className={Styles.infoIcon}><item.Icon aria-hidden="true" /></span>
                                <div>
                                    <h3>{item.title}</h3>
                                    {item.lines.map(line => <p key={line}>{line}</p>)}
                                </div>
                            </div>
                        ))}
                    </aside>

                    <div className={Styles.contactForm}>
                        {submitted ? (
                            <div className={Styles.successPanel} role="status">
                                <span className={Styles.successIcon}><PiCheckCircle aria-hidden="true" /></span>
                                <h2>Message sent</h2>
                                <p>
                                    Thanks, {formData.name.split(' ')[0]}. Your note is in the queue —
                                    expect a reply at {formData.email} within one business day.
                                </p>
                                <button type="button" className={Styles.againBtn} onClick={handleReset}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2>Send a message</h2>
                                {error && <p className={Styles.errorBanner} role="alert">{error}</p>}
                                <form className={Styles.form} onSubmit={handleSubmit} noValidate>
                                    <div className={Styles.formRow}>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Your full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                autoComplete="name"
                                                required
                                            />
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="you@business.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                autoComplete="email"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={Styles.formGroup}>
                                        <label htmlFor="phone">Phone <span className={Styles.optional}>optional</span></label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="tel"
                                        />
                                    </div>
                                    <div className={Styles.formGroup}>
                                        <label htmlFor="subject">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            placeholder="What is this about?"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className={Styles.formGroup}>
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="5"
                                            placeholder="Tell us about your business and what you need..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className={Styles.submitBtn}>
                                        Send message <PiPaperPlaneTilt aria-hidden="true" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
