import { useNavigate } from 'react-router-dom'
import Styles from '../styles/About.module.css'
import { getIsLoggedIn } from '../utils/authEvents'
import { PiArrowRight, PiChartLineUp, PiCheckCircle, PiCompass, PiFileText, PiForkKnife, PiGasPump, PiPackage, PiReceipt, PiStorefront, PiTarget, PiWrench } from 'react-icons/pi'

const OFFERINGS = [
    {
        Icon: PiChartLineUp,
        title: 'Real-time analytics',
        body: 'Sales, margins and trends update as the shift happens, not after. See which hour, pump, dish or shelf is actually earning.'
    },
    {
        Icon: PiPackage,
        title: 'Stock management',
        body: 'Tanks, pantry and shelves count themselves down with every sale, and warn you well before a customer hears "finished".'
    },
    {
        Icon: PiReceipt,
        title: 'Sales tracking',
        body: 'One entry at the counter writes the full record — payment split, staff attribution and running totals included.'
    },
    {
        Icon: PiFileText,
        title: 'Reports that close clean',
        body: 'Daily close-ups and custom-period exports reconcile to the last unit, ready to hand to your accountant.'
    }
];

const AUDIENCES = [
    { Icon: PiGasPump, label: 'Fuel stations tracking every liter' },
    { Icon: PiForkKnife, label: 'Restaurants running orders and kitchen stock' },
    { Icon: PiStorefront, label: 'Retail stores managing counters and inventory' },
    { Icon: PiWrench, label: 'Service centers logging jobs, parts and history' }
];

const PRINCIPLES = [
    'Counts first — every screen starts from real ledger numbers',
    'Alert before trouble, not after the day is done',
    'One system per business line, shaped to that trade',
    'Data that exports cleanly, because it is yours'
];

const About = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate(getIsLoggedIn() ? '/dashboard' : '/Signup');
    };

    return (
        <div className={Styles.about}>
            <header className={Styles.hero}>
                <div className={Styles.container}>
                    <p className={Styles.kicker}>About BizPulse</p>
                    <h1 className={Styles.title}>
                        Built for the owner who counts every liter, plate and part.
                    </h1>
                    <p className={Styles.tagline}>
                        BizPulse is a management workspace for the businesses that run on tight
                        margins and busy counters — fuel stations, restaurants, retail stores and
                        service centers.
                    </p>
                </div>
            </header>

            <div className={Styles.container}>
                <section className={Styles.mission}>
                    <div className={Styles.missionIcon}><PiTarget aria-hidden="true" /></div>
                    <div>
                        <h2>Why we exist</h2>
                        <p>
                            Most small and mid-size businesses still close their day with a calculator,
                            a register book and a phone call to the pump boy or the store manager.
                            BizPulse replaces that ritual with a single ledger that updates itself as
                            work happens — so the evening close takes minutes, and the numbers agree
                            with the cash drawer.
                        </p>
                    </div>
                </section>

                <section className={Styles.section}>
                    <div className={Styles.sectionHead}>
                        <span className={Styles.sectionKicker}>What you get</span>
                        <h2>Four tools, one ledger</h2>
                    </div>
                    <div className={Styles.features}>
                        {OFFERINGS.map((item) => (
                            <article key={item.title} className={Styles.feature}>
                                <span className={Styles.featureIcon}><item.Icon aria-hidden="true" /></span>
                                <h3>{item.title}</h3>
                                <p>{item.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={Styles.section}>
                    <div className={Styles.sectionHead}>
                        <span className={Styles.sectionKicker}>Who it serves</span>
                        <h2>Shaped for your trade, not a generic template</h2>
                    </div>
                    <ul className={Styles.audiences}>
                        {AUDIENCES.map((item) => (
                            <li key={item.label}>
                                <span className={Styles.audienceIcon}><item.Icon aria-hidden="true" /></span>
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={Styles.principles}>
                    <div className={Styles.principlesIntro}>
                        <span className={Styles.principlesIcon}><PiCompass aria-hidden="true" /></span>
                        <h2>How we build</h2>
                        <p>Four rules decide every screen that ships in BizPulse.</p>
                    </div>
                    <ul className={Styles.principlesList}>
                        {PRINCIPLES.map((item, i) => (
                            <li key={item} style={{ animationDelay: `${i * 80}ms` }}>
                                <PiCheckCircle aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className={Styles.cta}>
                    <h2>See it on your own numbers</h2>
                    <p>Create a workspace, pick your business line, and close tonight's shift with clean math.</p>
                    <button className={Styles.ctaButton} onClick={handleGetStarted}>
                        Open your workspace <PiArrowRight aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
