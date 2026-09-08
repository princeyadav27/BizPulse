import { useState, useEffect } from 'react';
import Styles from '../styles/BusinessThoughts.module.css';

const thoughtsList = [
    {
        quote: "Success is not final; failure is not fatal: It is the courage to continue that counts.",
        author: "Winston Churchill",
        insight: "Persistence is the ultimate driver in business. Every setback is just data for your next attempt."
    },
    {
        quote: "Quality means doing it right when no one is looking. Deliver excellence every single time.",
        author: "Henry Ford",
        insight: "Your reputation is built on the details that customers notice only when they are missing."
    },
    {
        quote: "Your customer doesn't care how much you know until they know how much you care.",
        author: "Damon Richards",
        insight: "Customer service is not a department; it's an attitude that defines your entire business model."
    },
    {
        quote: "Chase the vision, not the money. The money will end up following you.",
        author: "Tony Hsieh",
        insight: "A strong purpose attracts loyal customers and passionate team members far better than just a profit margin."
    },
    {
        quote: "Success is the key to happiness. Happiness is the key to success. Love what you do.",
        author: "Albert Schweitzer",
        insight: "If you love what you are building, that energy will translate directly into your product and customer experience."
    },
    {
        quote: "Don't find customers for your products, find products for your customers.",
        author: "Seth Godin",
        insight: "Listen closely to your audience. True innovation comes from solving real pain points they already have."
    },
    {
        quote: "A business that makes nothing but money is a poor business. Focus on value creation.",
        author: "Henry Ford",
        insight: "Prioritize delivering value. When your customer wins, your business wins automatically."
    },
    {
        quote: "Your most unhappy customers are your greatest source of learning. Listen to them.",
        author: "Bill Gates",
        insight: "Negative feedback is free consulting. Use it to patch leaks in your business model before it's too late."
    },
    {
        quote: "The secret of change is to focus all of your energy, not on fighting the old, but on building the new.",
        author: "Socrates",
        insight: "Don't waste time defending outdated methods. Pivot fast and embrace modern tools and workflows."
    },
    {
        quote: "Great things in business are never done by one person. They are done by a team of people.",
        author: "Steve Jobs",
        insight: "Empower your staff, delegate tasks, and build an environment where everyone can contribute their best work."
    },
    {
        quote: "A satisfied customer is the best business strategy of all. Build lasting relationships.",
        author: "Michael LeBoeuf",
        insight: "Acquiring a new customer is expensive. Retaining an existing one through stellar experience is highly profitable."
    },
    {
        quote: "Opportunities do not just happen. You create them through focus and action.",
        author: "Chris Grosser",
        insight: "Proactive improvements today yield exponential returns tomorrow. Don't wait for the perfect moment."
    },
    {
        quote: "Execution is everything. There is no shortage of remarkable ideas, only the will to execute them.",
        author: "Seth Godin",
        insight: "An average idea executed perfectly is infinitely better than a brilliant idea that stays on paper."
    },
    {
        quote: "The golden rule for every business is to put yourself in your customer's place.",
        author: "Orison Swett Marden",
        insight: "Empathy-driven business design helps you build products and services that people love to use."
    },
    {
        quote: "Good leaders create a vision, articulate the vision, passionately own it, and drive it to completion.",
        author: "Jack Welch",
        insight: "Clear goals align your team, build trust, and ensure everyone is pulling in the same direction."
    },
    {
        quote: "The best way to predict the future is to create it. Start building today.",
        author: "Peter Drucker",
        insight: "Don't just react to market shifts. Set the pace through proactive decisions and customer-centric features."
    },
    {
        quote: "If you are not embarrassed by the first version of your product, you launched too late.",
        author: "Reid Hoffman",
        insight: "Speed to market beats perfection. Launch, collect user feedback, iterate, and improve in real-time."
    },
    {
        quote: "Visions without execution are just hallucinations. Focus on daily progress.",
        author: "Thomas Edison",
        insight: "Break large goals down into daily executable actions. Consistency is the secret sauce."
    },
    {
        quote: "Capital is not scarce; vision is. Expand your horizons and think big.",
        author: "Sam Walton",
        insight: "When you have a clear, compelling plan, the resources, team, and funding will align to make it happen."
    },
    {
        quote: "Do not buy into the 20-hour workday myth. Work smart, rest well, and sustain your energy.",
        author: "Jason Fried",
        insight: "Burnout is not a badge of honor. High performance requires clear minds, good health, and focus."
    },
    {
        quote: "A brand is like a reputation. You earn it by trying to do hard things well.",
        author: "Jeff Bezos",
        insight: "Brand value is built on consistent quality, honesty, and resolving issues gracefully when they occur."
    },
    {
        quote: "Outstanding leaders go out of their way to boost the self-esteem of their personnel.",
        author: "Sam Walton",
        insight: "When people feel valued and appreciated, they take pride in their work and treat customers better."
    },
    {
        quote: "Innovation is the ability to see change as an opportunity, not a threat.",
        author: "Steve Jobs",
        insight: "Keep looking ahead. Shift with changing trends and tech stack rather than clinging to the status quo."
    },
    {
        quote: "The only limit to our realization of tomorrow will be our doubts of today.",
        author: "Franklin D. Roosevelt",
        insight: "Act with confidence. Clear decisions create momentum and build confidence in your team."
    }
];

const BusinessThoughts = ({ businessType }) => {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [progress, setProgress] = useState(0);
    const [thought, setThought] = useState(thoughtsList[0]);

    const getThoughtIndex = () => {
        // Generates an index that updates exactly every hour (epoch hour)
        const hourEpoch = Math.floor(Date.now() / 3600000);
        return hourEpoch % thoughtsList.length;
    };

    useEffect(() => {
        const updateThoughtAndTimer = () => {
            const index = getThoughtIndex();
            setThought(thoughtsList[index]);

            // Calculate minutes remaining until the next hour
            const now = new Date();
            const minutesRemaining = 60 - now.getMinutes();
            setTimeRemaining(`${minutesRemaining} min${minutesRemaining !== 1 ? 's' : ''}`);

            // Calculate progress percentage through the current hour (0-100)
            const minutesElapsed = now.getMinutes() + (now.getSeconds() / 60);
            const percent = (minutesElapsed / 60) * 100;
            setProgress(percent);
        };

        updateThoughtAndTimer();
        
        // Update countdown every 30 seconds
        const timer = setInterval(updateThoughtAndTimer, 30000);
        return () => clearInterval(timer);
    }, []);

    // Get display icon based on business type
    const getIcon = () => {
        switch (businessType) {
            case 'petrol-pump': return 'PP';
            case 'restaurant': return 'RT';
            case 'retail': return 'RL';
            case 'service': return 'SV';
            default: return 'TP';
        }
    };

    const businessClass = Styles[businessType] || Styles.general;

    return (
        <div className={`${Styles.thoughtsCard} ${businessClass}`}>
            <div className={Styles.cardDecorator}>“</div>
            <div className={Styles.cardHeader}>
                <span className={Styles.tag}>
                    <span className={Styles.icon}>{getIcon()}</span>
                    Hourly Insight
                </span>
                <span className={Styles.timer}>
                    <span className={Styles.pulseDot}></span>
                    Next update in: {timeRemaining}
                </span>
            </div>
            <div className={Styles.cardBody}>
                <blockquote className={Styles.quoteText}>
                    "{thought.quote}"
                </blockquote>
                <cite className={Styles.quoteAuthor}>— {thought.author}</cite>
                <p className={Styles.quoteInsight}>{thought.insight}</p>
            </div>
            {/* Hour Progress Bar */}
            <div className={Styles.progressBar}>
                <div className={Styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default BusinessThoughts;
