import { useState, useEffect } from 'react';
import Styles from '../styles/BusinessNews.module.css';

const newsDatabase = {
    'petrol-pump': [
        {
            id: 'pp-1',
            source: 'Global Energy Press',
            time: '12m ago',
            title: 'Crude Oil Prices Stabilize Amid Production Realignments',
            snippet: 'Brent crude hovers near $78 per barrel as global supply chains stabilize. Fuel pump owners report stable operating margins.'
        },
        {
            id: 'pp-2',
            source: 'EcoVolt',
            time: '2h ago',
            title: 'Government Grants 40% Subsidy for EV Chargers at Petrol Pumps',
            snippet: 'New infrastructure policy provides direct subsidies to petrol pump owners who integrate fast-charging EV bays into their stations.'
        },
        {
            id: 'pp-3',
            source: 'PumpTech Weekly',
            time: '4h ago',
            title: 'Advanced Cloud POS Systems Drastically Cut Wait Times',
            snippet: 'Case studies show pump license plate billing and digital payments cut peak-hour customer transaction times by an average of 45 seconds.'
        },
        {
            id: 'pp-4',
            source: 'Biofuel Journal',
            time: '1d ago',
            title: 'Upcoming E20 Biofuel Blend Rollout Requirements Released',
            snippet: 'Regulators released compliance instructions for petrol stations preparing storage tanks and pumps for higher ethanol biofuel ratios next month.'
        },
        {
            id: 'pp-5',
            source: 'PetroFinance',
            time: '2d ago',
            title: 'Retail Fuel Sales Projected to Rise by 6% in Upcoming Quarter',
            snippet: 'Increased transport activity and summer travel forecasts point to a strong surge in petrol and diesel retail volumes.'
        }
    ],
    'restaurant': [
        {
            id: 'res-1',
            source: 'Culinary Times',
            time: '25m ago',
            title: 'Plant-Based Menu Additions Drive 22% Revenue Surge',
            snippet: 'Diners are actively looking for eco-conscious and healthy options. Adding premium vegetarian options boosts ticket size.'
        },
        {
            id: 'res-2',
            source: 'RestoBiz',
            time: '1h ago',
            title: 'AI-Based Inventory Systems Help Reduce Waste by 15%',
            snippet: 'Smart forecasting engines analyse previous order histories and weather patterns to optimise raw material purchasing daily.'
        },
        {
            id: 'res-3',
            source: 'Dining Standard',
            time: '3h ago',
            title: 'QR Code Ordering Remains the Top Convenience Metric for Diners',
            snippet: 'Surveys indicate 68% of customers prefer scanning table QR codes to browse the menu, add orders, and pay instantly without delay.'
        },
        {
            id: 'res-4',
            source: 'SupplyChain Hub',
            time: '1d ago',
            title: 'Local Farming Partnerships Safeguard Restaurant Margins',
            snippet: 'Chefs who contract directly with local agricultural co-ops avoid global shipping inflation and guarantee ingredient freshness.'
        },
        {
            id: 'res-5',
            source: 'Hospitality HR',
            time: '2d ago',
            title: 'Innovative Tips Distribution Programs Boost Staff Retention',
            snippet: 'Transparent, automated tipping software leads to higher kitchen staff satisfaction and reduces back-of-house employee turnover.'
        }
    ],
    'retail': [
        {
            id: 'ret-1',
            source: 'Retail Insider',
            time: '8m ago',
            title: 'Omnichannel Integrations Boost Retail Retention Rates by 30%',
            snippet: 'Independent stores linking their stock directly with local hyper-local delivery apps see a high rate of recurring local customers.'
        },
        {
            id: 'ret-2',
            source: 'RetailTech Today',
            time: '2h ago',
            title: 'IoT Smart Shelving Systems Gain Popularity in Mid-Sized Outlets',
            snippet: 'Weight-sensing shelf plates instantly trigger stockroom alerts and supply orders when popular products run low.'
        },
        {
            id: 'ret-3',
            source: 'ShopTrend Reports',
            time: '5h ago',
            title: 'Personalized Loyalty Deals Outperform Global Sales',
            snippet: 'Targeting specific customer groups with offers based on their purchasing habits generates 3x more store visits than store-wide discounts.'
        },
        {
            id: 'ret-4',
            source: 'Sustainable Shop',
            time: '1d ago',
            title: 'Eco-Packaging Attracts Environmentally Conscious Buyers',
            snippet: 'Over 70% of millennial consumers are willing to spend slightly more at stores that package items in recycled or biodegradable bags.'
        },
        {
            id: 'ret-5',
            source: 'BizFin Analyst',
            time: '2d ago',
            title: 'Visual Merchandising Upgrades Increase Impulse Buys by 18%',
            snippet: 'Reorganizing the checkout queue line with high-margin items and improving lighting dramatically rises daily checkout basket totals.'
        }
    ],
    'service': [
        {
            id: 'srv-1',
            source: 'AutoCare Digest',
            time: '15m ago',
            title: 'Cloud Diagnosis Tools Halve Vehicle Assessment Times',
            snippet: 'Next-generation OBD-III software pinpoints engine and electrical errors instantly, streamlining technician scheduling.'
        },
        {
            id: 'srv-2',
            source: 'Service Leader',
            time: '3h ago',
            title: 'SMS Service Appointment Reminders Drive 25% Growth',
            snippet: 'Automated messages for scheduled servicing, oil changes, and fluid top-ups maintain high workshop occupancy rates.'
        },
        {
            id: 'srv-3',
            source: 'OSHA Bulletin',
            time: '6h ago',
            title: 'Safety Standards Updated for Hybrid Vehicle Repairs',
            snippet: 'Workshop owners are instructed to implement new insulated toolkit standards and high-voltage training programs immediately.'
        },
        {
            id: 'srv-4',
            source: 'Parts Logistics',
            time: '1d ago',
            title: 'Expected Shortages in OEM Braking Components Next Month',
            snippet: 'Service managers are advised to stockpile common rotors and brake pads to prevent service delays due to shipping delays.'
        },
        {
            id: 'srv-5',
            source: 'ClientConnect',
            time: '2d ago',
            title: 'Digital Customer Inspection Sheets Improve Trust and Approvals',
            snippet: 'Sending photos and repair quotes via SMS directly to vehicle owners yields faster service approvals and higher satisfaction.'
        }
    ],
    'general': [
        {
            id: 'gen-1',
            source: 'Financial News',
            time: '18m ago',
            title: 'Digital Merchant Limits Raised to Ease High-Value Payments',
            snippet: 'Financial institutions increased daily transaction limits for business instant payments, lowering settlement waiting times.'
        },
        {
            id: 'gen-2',
            source: 'Business Finance',
            time: '2h ago',
            title: 'Small Business Loan Rates Drop by 0.5% Under Green Initiative',
            snippet: 'New SBA interest rates cut borrowing costs for independent businesses investing in energy-efficient equipment and upgrades.'
        },
        {
            id: 'gen-3',
            source: 'Efficiency Today',
            time: '4h ago',
            title: 'Automated Accounting Software Saves Business Owners 15 Hours Weekly',
            snippet: 'Syncing cloud invoicing platforms with bank feeds reduces double-entry and prepares accurate logs for annual tax filings.'
        },
        {
            id: 'gen-4',
            source: 'Workplace HR',
            time: '1d ago',
            title: 'Employee Benefit Programs directly Reduce Annual Retention Cost',
            snippet: 'Offering health benefits and flexible shifts are the primary reasons employees choose independent operations over large chains.'
        },
        {
            id: 'gen-5',
            source: 'SMB Explorer',
            time: '2d ago',
            title: 'Local SEO Listing Management Increases Store Foot Traffic',
            snippet: 'Keeping Google Business profiles updated with correct hours, photos, and reviews remains the cheapest high-ROI marketing strategy.'
        }
    ]
};

const BusinessNews = ({ businessType }) => {
    const [newsItems, setNewsItems] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getBusinessKey = (type) => {
        return ['petrol-pump', 'restaurant', 'retail', 'service'].includes(type) ? type : 'general';
    };

    const loadNews = (type, isShuffling = false) => {
        const key = getBusinessKey(type);
        const allNews = newsDatabase[key];
        
        if (isShuffling) {
            // Randomly select 3 articles to simulate an updated news feed
            const shuffled = [...allNews].sort(() => 0.5 - Math.random());
            setNewsItems(shuffled.slice(0, 3));
        } else {
            // Load first 3 articles initially
            setNewsItems(allNews.slice(0, 3));
        }
    };

    useEffect(() => {
        loadNews(businessType);
    }, [businessType]);

    const handleRefresh = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        
        // Simulate network fetch
        setTimeout(() => {
            loadNews(businessType, true);
            setIsRefreshing(false);
        }, 800); // spin for 800ms
    };

    const getIcon = () => {
        switch (businessType) {
            case 'petrol-pump': return 'PP';
            case 'restaurant': return 'RT';
            case 'retail': return 'RL';
            case 'service': return 'SV';
            default: return 'NW';
        }
    };

    const businessClass = Styles[businessType] || Styles.general;

    return (
        <div className={`${Styles.newsCard} ${businessClass}`}>
            <div className={Styles.cardHeader}>
                <div className={Styles.liveHeader}>
                    <span className={Styles.tag}>
                        <span className={Styles.icon}>{getIcon()}</span>
                        Industry News
                    </span>
                    <span className={Styles.pulseDot} title="Live Feed Connected"></span>
                </div>
                
                <button 
                    className={`${Styles.refreshBtn} ${isRefreshing ? Styles.spinning : ''}`}
                    onClick={handleRefresh}
                    title="Refresh News Feed"
                    disabled={isRefreshing}
                >
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                    </svg>
                </button>
            </div>
            
            <div className={Styles.newsList}>
                {newsItems.map((item) => (
                    <div key={item.id} className={Styles.newsItem}>
                        <div className={Styles.itemMeta}>
                            <span className={Styles.source}>{item.source}</span>
                            <span className={Styles.divider}>•</span>
                            <span className={Styles.time}>{item.time}</span>
                        </div>
                        <h4 className={Styles.itemTitle}>{item.title}</h4>
                        <p className={Styles.itemSnippet}>{item.snippet}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessNews;
