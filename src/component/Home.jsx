import Styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getIsLoggedIn } from '../utils/authEvents'
import { PiArrowRight, PiBellRinging, PiChartLineUp, PiCheckCircle, PiFileText, PiForkKnife, PiGasPump, PiGauge, PiPackage, PiStorefront, PiUsersThree, PiWrench } from 'react-icons/pi'

const TICKER_STATS = [
    { label: 'Petrol sold today', value: '4,218.40 L', trend: '+6.2% vs yesterday' },
    { label: 'Counter sales this week', value: '₹ 2.84 L', trend: '+11.7% vs last week' },
    { label: 'Open tables right now', value: '9 of 14', trend: 'service rush window' },
    { label: 'Jobs in queue', value: '17', trend: '3 awaiting parts' }
];

const QUOTES = [
    {
        text: 'Closing the day used to take forty minutes of tallying slips. Now the numbers match in four.',
        name: 'Harsha Patel',
        role: 'Runs a two-pump fuel station in Bharuch'
    },
    {
        text: 'We caught a menu item quietly losing money for months. The ingredient stock view paid for itself.',
        name: 'Rithika Sharma',
        role: 'Owns a 14-table family restaurant'
    },
    {
        text: 'Three counters, one stock list. My staff stopped calling me for prices during rush hour.',
        name: 'Akhilesh Yadav',
        role: 'Manages a grocery retail counter in Vadodara'
    }
];

const BUSINESS_LINES = [
    { name: 'Petrol Pump', Icon: PiGasPump, detail: 'Tank dips, nozzle readings, fuel margins' },
    { name: 'Restaurant', Icon: PiForkKnife, detail: 'Orders, KOTs, billing and kitchen stock' },
    { name: 'Retail Store', Icon: PiStorefront, detail: 'Counter sales, inventory and staff shifts' },
    { name: 'Service Center', Icon: PiWrench, detail: 'Job cards, parts and vehicle history' }
];

const Home = () => {
    const navigate = useNavigate();
    const [tickerIndex, setTickerIndex] = useState(0);
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const ticker = setInterval(() => setTickerIndex(i => (i + 1) % TICKER_STATS.length), 3400);
        const quotes = setInterval(() => setQuoteIndex(i => (i + 1) % QUOTES.length), 6000);
        return () => { clearInterval(ticker); clearInterval(quotes); };
    }, []);

    const goToWorkspace = (path = '/dashboard') => {
        if (!getIsLoggedIn()) {
            navigate('/Signup', { state: { notice: 'Create a free account to unlock the business workspace.' } });
        } else {
            navigate(path);
        }
    };

    const ticker = TICKER_STATS[tickerIndex];
    const quote = QUOTES[quoteIndex];

    return (
        <div className={Styles.home}>
            {/* ================= Hero ================= */}
            <section className={Styles.hero}>
                <div className={Styles.heroInner}>
                    <div className={Styles.heroCopy}>
                        <p className={Styles.eyebrow}>
                            <span className={Styles.liveDot} aria-hidden="true" />
                            Business management, minus the tally books
                        </p>
                        <h1 className={Styles.heroTitle}>
                            Run your pump, kitchen or counter from one calm screen.
                        </h1>
                        <p className={Styles.heroText}>
                            BizPulse pulls sales, stock, staff and daily reports for fuel stations,
                            restaurants, retail stores and service centers into a single workspace —
                            so every shift ends with numbers that already match.
                        </p>
                        <div className={Styles.heroActions}>
                            <button className={Styles.primaryBtn} onClick={() => goToWorkspace()}>
                                Start working free <PiArrowRight aria-hidden="true" />
                            </button>
                            <Link to="/About" className={Styles.textLink}>
                                How it works
                            </Link>
                        </div>
                        <dl className={Styles.heroStats}>
                            <div>
                                <dt>Setup time</dt>
                                <dd>Under 2 min</dd>
                            </div>
                            <div>
                                <dt>Business lines</dt>
                                <dd>4 ready-made</dd>
                            </div>
                            <div>
                                <dt>Reports</dt>
                                <dd>Daily and custom</dd>
                            </div>
                        </dl>
                    </div>

                    <div className={Styles.heroVisual} aria-hidden="true">
                        <div className={Styles.mockDash}>
                            <div className={Styles.mockTopbar}>
                                <span className={Styles.mockDot} />
                                <span className={Styles.mockDot} />
                                <span className={Styles.mockDot} />
                                <span className={Styles.mockTitle}>BizPulse — Today's pulse</span>
                            </div>
                            <div className={Styles.mockBody}>
                                <div className={Styles.mockKpis}>
                                    <div className={Styles.mockKpi}>
                                        <span className={Styles.mockKpiLabel}>Revenue</span>
                                        <span className={Styles.mockKpiValue}>₹ 64,120</span>
                                        <span className={Styles.mockKpiUp}>+8.4%</span>
                                    </div>
                                    <div className={Styles.mockKpi}>
                                        <span className={Styles.mockKpiLabel}>Stock left</span>
                                        <span className={Styles.mockKpiValue}>71.3%</span>
                                        <span className={Styles.mockKpiFlat}>healthy</span>
                                    </div>
                                    <div className={Styles.mockKpi}>
                                        <span className={Styles.mockKpiLabel}>Staff on shift</span>
                                        <span className={Styles.mockKpiValue}>11</span>
                                        <span className={Styles.mockKpiFlat}>2 stations</span>
                                    </div>
                                </div>
                                <div className={Styles.mockChart}>
                                    {[42, 58, 45, 72, 63, 88, 76, 95, 84, 100, 91, 78].map((h, i) => (
                                        <span
                                            key={i}
                                            className={Styles.mockBar}
                                            style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                                        />
                                    ))}
                                </div>
                                <div className={Styles.mockTicker} key={tickerIndex}>
                                    <span className={Styles.mockTickerLabel}>{ticker.label}</span>
                                    <span className={Styles.mockTickerRow}>
                                        <span className={Styles.mockTickerValue}>{ticker.value}</span>
                                        <span className={Styles.mockTickerTrend}>{ticker.trend}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={Styles.floatCard} style={{ animationDelay: '1.2s' }}>
                            <PiBellRinging aria-hidden="true" />
                            <div>
                                <strong>Stock alert sent</strong>
                                <span>Diesel at reorder level — 12:42 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Business lines ================= */}
            <section className={Styles.lines}>
                <div className={Styles.container}>
                    <div className={Styles.sectionHead}>
                        <span className={Styles.sectionKicker}>One login, four trades</span>
                        <h2 className={Styles.sectionTitle}>Pick your business line. The app reshapes itself.</h2>
                    </div>
                    <div className={Styles.linesGrid}>
                        {BUSINESS_LINES.map((line, i) => (
                            <button
                                key={line.name}
                                className={Styles.lineCard}
                                style={{ animationDelay: `${i * 90}ms` }}
                                onClick={() => goToWorkspace('/dashboard')}
                            >
                                <span className={Styles.lineIcon}><line.Icon aria-hidden="true" /></span>
                                <span className={Styles.lineName}>{line.name}</span>
                                <span className={Styles.lineDetail}>{line.detail}</span>
                                <span className={Styles.lineCta}>Open workspace <PiArrowRight aria-hidden="true" /></span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= Feature zig-zag ================= */}
            <section className={Styles.features}>
                <div className={Styles.container}>
                    <div className={Styles.sectionHead}>
                        <span className={Styles.sectionKicker}>What runs inside</span>
                        <h2 className={Styles.sectionTitle}>Everything the counter needs. Nothing it doesn't.</h2>
                    </div>

                    <div className={Styles.zigzag}>
                        <article className={Styles.zzRow}>
                            <div className={Styles.zzText}>
                                <span className={Styles.zzIcon}><PiChartLineUp aria-hidden="true" /></span>
                                <h3>Sales that write themselves up</h3>
                                <p>
                                    Record a sale once — at the nozzle, the table or the till — and BizPulse
                                    updates the day's totals, margins and staff splits instantly. No evening
                                    re-entry, no second register.
                                </p>
                                <ul className={Styles.zzList}>
                                    <li><PiCheckCircle aria-hidden="true" /> Fuel, food and counter sales in one ledger</li>
                                    <li><PiCheckCircle aria-hidden="true" /> Per-shift breakdowns for handovers</li>
                                </ul>
                            </div>
                            <div className={Styles.zzVisual}>
                                <div className={Styles.zzCard}>
                                    <span className={Styles.zzCardLabel}>Today's sales</span>
                                    <span className={Styles.zzCardValue}>₹ 64,120.50</span>
                                    <div className={Styles.zzSparkrow}>
                                        {[30, 55, 40, 70, 62, 85, 100].map((h, i) => (
                                            <span key={i} className={Styles.zzSpark} style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <span className={Styles.zzCardFoot}>Shift A · 8:00 AM – 4:00 PM</span>
                                </div>
                            </div>
                        </article>

                        <article className={`${Styles.zzRow} ${Styles.zzFlip}`}>
                            <div className={Styles.zzText}>
                                <span className={Styles.zzIcon}><PiPackage aria-hidden="true" /></span>
                                <h3>Stock that warns you first</h3>
                                <p>
                                    Set tank, pantry or shelf thresholds once. BizPulse watches levels as sales
                                    land and pings you before "out of stock" reaches a customer's ears.
                                </p>
                                <ul className={Styles.zzList}>
                                    <li><PiCheckCircle aria-hidden="true" /> Reorder alerts with remaining quantities</li>
                                    <li><PiCheckCircle aria-hidden="true" /> Purchase history against every refill</li>
                                </ul>
                            </div>
                            <div className={Styles.zzVisual}>
                                <div className={Styles.zzCard}>
                                    <span className={Styles.zzCardLabel}>Diesel — Tank 2</span>
                                    <div className={Styles.zzGauge}>
                                        <span className={Styles.zzGaugeFill} style={{ width: '23%' }} />
                                    </div>
                                    <span className={Styles.zzCardValue}>1,208.65 L left</span>
                                    <span className={`${Styles.zzCardFoot} ${Styles.warnText}`}>Below reorder level — refill advised</span>
                                </div>
                            </div>
                        </article>

                        <article className={Styles.zzRow}>
                            <div className={Styles.zzText}>
                                <span className={Styles.zzIcon}><PiFileText aria-hidden="true" /></span>
                                <h3>Reports your CA can use directly</h3>
                                <p>
                                    Daily close, custom date ranges, staff-wise and item-wise splits — exported
                                    clean, reconciled to the last unit. The day's math is done when the shutters
                                    come down.
                                </p>
                                <ul className={Styles.zzList}>
                                    <li><PiCheckCircle aria-hidden="true" /> One-click daily close summary</li>
                                    <li><PiCheckCircle aria-hidden="true" /> Custom period exports, no reformatting</li>
                                </ul>
                            </div>
                            <div className={Styles.zzVisual}>
                                <div className={Styles.zzCard}>
                                    <span className={Styles.zzCardLabel}>Daily close — Sep 7</span>
                                    <div className={Styles.zzRows}>
                                        <div className={Styles.zzMiniRow}><span>Cash</span><strong>₹ 31,840.00</strong></div>
                                        <div className={Styles.zzMiniRow}><span>UPI</span><strong>₹ 27,113.50</strong></div>
                                        <div className={Styles.zzMiniRow}><span>Card</span><strong>₹ 5,167.00</strong></div>
                                        <div className={`${Styles.zzMiniRow} ${Styles.totalRow}`}><span>Total</span><strong>₹ 64,120.50</strong></div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* ================= Quote wall ================= */}
            <section className={Styles.quotes}>
                <div className={Styles.container}>
                    <blockquote className={Styles.quote} key={quoteIndex}>
                        <p className={Styles.quoteText}>"{quote.text}"</p>
                        <footer className={Styles.quoteMeta}>
                            <strong>{quote.name}</strong>
                            <span>{quote.role}</span>
                        </footer>
                    </blockquote>
                    <div className={Styles.quoteDots} role="tablist" aria-label="Testimonials">
                        {QUOTES.map((q, i) => (
                            <button
                                key={q.name}
                                role="tab"
                                aria-selected={i === quoteIndex}
                                aria-label={`Quote from ${q.name}`}
                                className={`${Styles.quoteDot} ${i === quoteIndex ? Styles.quoteDotActive : ''}`}
                                onClick={() => setQuoteIndex(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className={Styles.cta}>
                <div className={Styles.container}>
                    <div className={Styles.ctaPanel}>
                        <div className={Styles.ctaCopy}>
                            <span className={Styles.ctaIcon}><PiGauge aria-hidden="true" /></span>
                            <h2>Bring tomorrow's close-down to tonight's shift.</h2>
                            <p>Create a workspace, pick your business line, and enter your first sale. Free to start.</p>
                        </div>
                        <button className={Styles.ctaBtn} onClick={() => goToWorkspace()}>
                            Create your workspace <PiArrowRight aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= Footer ================= */}
            <footer className={Styles.footer}>
                <div className={Styles.container}>
                    <div className={Styles.footerTop}>
                        <Link to="/" className={Styles.footerBrand}>
                            <span className={Styles.brandMark} aria-hidden="true">
                                <svg viewBox="0 0 64 64" width="20" height="20">
                                    <path d="M10 38 L20 38 L26 18 L33 50 L39 30 L43 38 L54 38" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            BizPulse
                        </Link>
                        <nav className={Styles.footerNav} aria-label="Footer">
                            <Link to="/About">About</Link>
                            <Link to="/Contact">Contact</Link>
                            <Link to="/Login">Sign in</Link>
                            <Link to="/Signup">Create account</Link>
                        </nav>
                        <nav className={Styles.footerLegal} aria-label="Legal">
                            <Link to="/privacy">Privacy policy</Link>
                            <Link to="/terms">Terms of service</Link>
                        </nav>
                    </div>
                    <div className={Styles.footerBottom}>
                        <span>© 2026 BizPulse. Built for businesses that count closely.</span>
                        <span className={Styles.footerNote}><PiUsersThree aria-hidden="true" /> One workspace, every shift</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
