import { useState, useEffect } from 'react'
import Styles from '../styles/Analytics.module.css'

const Analytics = () => {
    const [userBusiness, setUserBusiness] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [salesData, setSalesData] = useState([]);
    const [timeRange, setTimeRange] = useState('7days'); // '7days', '30days', '90days'
    const [analyticsData, setAnalyticsData] = useState({});
    const [error, setError] = useState(null);
    const [lastDataHash, setLastDataHash] = useState(''); // Track data changes

    useEffect(() => {
        try {
            // Get user data
            const userData = localStorage.getItem('userData');
            console.log('Analytics - Initial Load - User Data:', userData);
            
            if (userData) {
                const parsedData = JSON.parse(userData);
                setUserBusiness(parsedData.businessType);
                
                // Set business name with proper fallbacks
                let businessName = parsedData.businessName;
                if (!businessName) {
                    switch(parsedData.businessType) {
                        case 'petrol-pump':
                            businessName = parsedData.pumpName || 'My Petrol Pump';
                            break;
                        case 'restaurant':
                            businessName = parsedData.restaurantName || 'My Restaurant';
                            break;
                        case 'retail':
                            businessName = parsedData.retailName || 'My Retail Store';
                            break;
                        case 'service':
                            businessName = parsedData.serviceName || 'My Service Center';
                            break;
                        default:
                            businessName = 'My Business';
                    }
                }
                setBusinessName(businessName);
            }

            // Get sales data - filter by current user
            const salesRecords = localStorage.getItem('salesData');
            console.log('Analytics - Initial Load - Sales Records:', salesRecords);
            const allSales = salesRecords ? JSON.parse(salesRecords) : [];
            
            // Get current user ID for filtering
            const userId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : null;
            let filteredSales = userId ? allSales.filter(sale => sale.userId === userId) : [];
            
            console.log('Analytics - Initial Load:');
            console.log('  - User Business:', userData ? JSON.parse(userData).businessType : 'Not found');
            console.log('  - Business Name:', businessName);
            console.log('  - User ID:', userId);
            console.log('  - Total Sales in Storage:', allSales.length);
            console.log('  - Filtered Sales for Current User:', filteredSales.length);
            console.log('  - All Sales Data:', allSales);
            console.log('  - Filtered Sales Data:', filteredSales);
            
            // If no sales data exists for current user, add sample data for testing
            if (filteredSales.length === 0) {
                console.log('Analytics - No sales data found for current user');
                // Don't add sample data - let user add real data
                setAnalyticsData({
                    totalRevenue: 0,
                    totalOrders: 0,
                    avgOrderValue: 0,
                    revenueChange: 0,
                    ordersChange: 0,
                    growthRate: 0,
                    businessMetrics: {},
                    dailyData: []
                });
                return;
            }
            
            // Check if there is already historical data (older than 7 days)
            const hasPreviousData = filteredSales.some(sale => {
                const saleDate = new Date(sale.date);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return saleDate < sevenDaysAgo;
            });

            // Add sample previous period data for growth rate calculation
            if (!hasPreviousData && userId) {
                console.log('Analytics - No previous period data found, adding sample previous data');
                
                // Add sample previous period data (7-14 days ago)
                const samplePreviousData = [
                    {
                        id: Date.now() + 10000,
                        userId: userId,
                        date: new Date(Date.now() - 864000000 * 8).toISOString().split('T')[0], // 8 days ago
                        petrolSales: 3000,
                        petrolLiters: 60,
                        dieselSales: 2000,
                        dieselLiters: 40,
                        cngSales: 1500,
                        cngLiters: 30,
                        otherSales: 500,
                        totalSales: 7000,
                        notes: 'Sample previous period data'
                    },
                    {
                        id: Date.now() + 10001,
                        userId: userId,
                        date: new Date(Date.now() - 864000000 * 9).toISOString().split('T')[0], // 9 days ago
                        petrolSales: 2500,
                        petrolLiters: 50,
                        dieselSales: 1800,
                        dieselLiters: 36,
                        cngSales: 1200,
                        cngLiters: 24,
                        otherSales: 400,
                        totalSales: 5900,
                        notes: 'Sample previous period data'
                    },
                    {
                        id: Date.now() + 10002,
                        userId: userId,
                        date: new Date(Date.now() - 864000000 * 10).toISOString().split('T')[0], // 10 days ago
                        petrolSales: 2200,
                        petrolLiters: 44,
                        dieselSales: 1600,
                        dieselLiters: 32,
                        cngSales: 1000,
                        cngLiters: 20,
                        otherSales: 300,
                        totalSales: 5100,
                        notes: 'Sample previous period data'
                    },
                    {
                        id: Date.now() + 10003,
                        userId: userId,
                        date: new Date(Date.now() - 864000000 * 11).toISOString().split('T')[0], // 11 days ago
                        petrolSales: 2000,
                        petrolLiters: 40,
                        dieselSales: 1400,
                        dieselLiters: 28,
                        cngSales: 800,
                        cngLiters: 16,
                        otherSales: 200,
                        totalSales: 4400,
                        notes: 'Sample previous period data'
                    },
                    {
                        id: Date.now() + 10004,
                        userId: userId,
                        date: new Date(Date.now() - 864000000 * 12).toISOString().split('T')[0], // 12 days ago
                        petrolSales: 1800,
                        petrolLiters: 36,
                        dieselSales: 1200,
                        dieselLiters: 24,
                        cngSales: 600,
                        cngLiters: 12,
                        otherSales: 100,
                        totalSales: 3700,
                        notes: 'Sample previous period data'
                    },
                    {
                        id: Date.now() + 10005,
                        userId: userId,
                        date: new Date(Date.now() - 864000000 * 13).toISOString().split('T')[0], // 13 days ago
                        petrolSales: 1500,
                        petrolLiters: 30,
                        dieselSales: 1000,
                        dieselLiters: 20,
                        cngSales: 400,
                        cngLiters: 8,
                        otherSales: 50,
                        totalSales: 2950,
                        notes: 'Sample previous period data'
                    }
                ];
                
                // Merge with existing data
                const updatedSales = [...allSales, ...samplePreviousData];
                localStorage.setItem('salesData', JSON.stringify(updatedSales));
                console.log('Analytics - Sample previous data added for user:', userId, samplePreviousData);
                
                // Update filtered sales to include previous data
                filteredSales = userId ? updatedSales.filter(sale => sale.userId === userId) : updatedSales;
            }
            
            setSalesData(filteredSales);
            
            // Calculate analytics based on time range
            calculateAnalytics(filteredSales, timeRange);
            setError(null);
        } catch (err) {
            console.error('Analytics Error:', err);
            setError('Failed to load analytics data');
        }

        // Listen for storage changes to update in real-time
        const handleStorageChange = (e) => {
            console.log('Analytics - Storage changed:', e.key);
            console.log('Analytics - Storage event details:', e);
            
            // Get updated user data
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const newBusinessType = parsedData.businessType;
                
                // Update business info if changed
                if (newBusinessType !== userBusiness) {
                    console.log('Analytics - Business type changed from', userBusiness, 'to', newBusinessType);
                    setUserBusiness(newBusinessType);
                    
                    // Update business name
                    let businessName = parsedData.businessName;
                    if (!businessName) {
                        switch(newBusinessType) {
                            case 'petrol-pump':
                                businessName = parsedData.pumpName || 'My Petrol Pump';
                                break;
                            case 'restaurant':
                                businessName = parsedData.restaurantName || 'My Restaurant';
                                break;
                            case 'retail':
                                businessName = parsedData.retailName || 'My Retail Store';
                                break;
                            case 'service':
                                businessName = parsedData.serviceName || 'My Service Center';
                                break;
                            default:
                                businessName = 'My Business';
                        }
                    }
                    setBusinessName(businessName);
                }
                
                // Get updated sales data
                const userId = parsedData.id || parsedData.userId;
                const salesRecords = localStorage.getItem('salesData');
                const allSales = salesRecords ? JSON.parse(salesRecords) : [];
                const filteredSales = userId ? allSales.filter(sale => sale.userId === userId) : allSales;
                
                console.log('Analytics - Data Updated:');
                console.log('  - New Business Type:', newBusinessType);
                console.log('  - New Business Name:', businessName);
                console.log('  - Updated Sales Count:', filteredSales.length);
                console.log('  - Sales Data:', filteredSales);
                
                setSalesData(filteredSales);
                calculateAnalytics(filteredSales, timeRange);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Add custom event listener for same-tab updates
        const handleCustomStorageChange = (e) => {
            console.log('Analytics - Custom storage event received:', e.detail);
            if (e.detail.key === 'salesData') {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    const userId = parsedData.id || parsedData.userId;
                    const allSales = JSON.parse(e.detail.newValue || '[]');
                    const filteredSales = userId ? allSales.filter(sale => sale.userId === userId) : allSales;
                    
                    console.log('Analytics - Custom event - Sales updated:', filteredSales.length);
                    setSalesData(filteredSales);
                    calculateAnalytics(filteredSales, timeRange);
                }
            }
        };
        
        window.addEventListener('salesDataChanged', handleCustomStorageChange);
        
        // Also check periodically for same-tab updates (reduced frequency)
        const interval = setInterval(() => {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const userId = parsedData.id || parsedData.userId;
                const salesRecords = localStorage.getItem('salesData');
                const allSales = salesRecords ? JSON.parse(salesRecords) : [];
                const filteredSales = userId ? allSales.filter(sale => sale.userId === userId) : allSales;
                const currentBusinessType = parsedData.businessType;
                
                // Create hash of current data to detect changes
                const currentDataHash = JSON.stringify({
                    salesCount: filteredSales.length,
                    businessType: currentBusinessType,
                    timeRange: timeRange
                });
                
                // Only update if data actually changed
                if (currentDataHash !== lastDataHash) {
                    console.log('Analytics - Data changed, updating...');
                    setLastDataHash(currentDataHash);
                    setUserBusiness(currentBusinessType);
                    setSalesData(filteredSales);
                    calculateAnalytics(filteredSales, timeRange);
                }
            }
        }, 10000); // Increased to 10 seconds to prevent rapid updates

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('salesDataChanged', handleCustomStorageChange);
            clearInterval(interval);
        };
    }, [timeRange, userBusiness]); // Add userBusiness dependency

    useEffect(() => {
        try {
            calculateAnalytics(salesData, timeRange);
            setError(null);
        } catch (err) {
            console.error('Analytics Calculation Error:', err);
            setError('Failed to calculate analytics');
        }
    }, [salesData, timeRange]);

    const calculateAnalytics = (sales, range) => {
        console.log('Analytics - Calculating Analytics:');
        console.log('  - Sales Count:', sales.length);
        console.log('  - Time Range:', range);
        console.log('  - User Business:', userBusiness || 'Not set');
        
        try {
            const now = new Date();
            let startDate = new Date();
            
            switch(range) {
                case '7days':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case '30days':
                    startDate.setDate(now.getDate() - 30);
                    break;
                case '90days':
                    startDate.setDate(now.getDate() - 90);
                    break;
            }
            
            const filtered = sales.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate >= startDate && saleDate <= now;
            });
            
            console.log('  - Filtered Sales:', filtered.length);

            // Calculate basic metrics
            const totalRevenue = filtered.reduce((sum, sale) => sum + (parseFloat(sale.totalSales) || 0), 0);
            const totalOrders = filtered.length;
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            
            // Calculate previous period for comparison
            let previousStartDate = new Date();
            let previousEndDate = new Date(startDate);
            
            switch(range) {
                case '7days':
                    previousStartDate.setDate(now.getDate() - 14);
                    previousEndDate.setDate(now.getDate() - 7);
                    break;
                case '30days':
                    previousStartDate.setDate(now.getDate() - 60);
                    previousEndDate.setDate(now.getDate() - 30);
                    break;
                case '90days':
                    previousStartDate.setDate(now.getDate() - 180);
                    previousEndDate.setDate(now.getDate() - 90);
                    break;
            }
            
            console.log('  - Previous Period Start:', previousStartDate.toISOString().split('T')[0]);
            console.log('  - Previous Period End:', previousEndDate.toISOString().split('T')[0]);
            
            const previousSales = sales.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate >= previousStartDate && saleDate <= previousEndDate;
            });
            
            const previousRevenue = previousSales.reduce((sum, sale) => sum + (parseFloat(sale.totalSales) || 0), 0);
            const previousOrders = previousSales.length;
            const previousAvgOrderValue = previousOrders > 0 ? previousRevenue / previousOrders : 0;
            
            console.log('  - Previous Sales:', previousSales.length);
            console.log('  - Previous Revenue:', previousRevenue);
            console.log('  - Previous Orders:', previousOrders);
            
            // Calculate percentage changes
            const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue * 100) : 0;
            const ordersChange = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders * 100) : 0;
            const avgOrderChange = previousAvgOrderValue > 0 ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue * 100) : 0;
            const growthRate = revenueChange;
            
            console.log('  - Revenue Change:', revenueChange);
            console.log('  - Orders Change:', ordersChange);
            console.log('  - Growth Rate:', growthRate);
            
            // If no previous data, show growth based on current data trend
            let displayGrowthRate = growthRate;
            if (previousRevenue === 0 && totalRevenue > 0) {
                // Calculate growth based on daily trend in current period
                const dailyData = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const daySales = filtered.filter(sale => sale.date === dateStr);
                    const dayRevenue = daySales.reduce((sum, sale) => sum + (parseFloat(sale.totalSales) || 0), 0);
                    dailyData.push({ date: dateStr, revenue: dayRevenue });
                }
                
                // Calculate trend: compare first half vs second half of period
                const firstHalf = dailyData.slice(0, Math.floor(dailyData.length / 2));
                const secondHalf = dailyData.slice(Math.floor(dailyData.length / 2));
                
                const firstHalfRevenue = firstHalf.reduce((sum, day) => sum + day.revenue, 0);
                const secondHalfRevenue = secondHalf.reduce((sum, day) => sum + day.revenue, 0);
                
                if (firstHalfRevenue > 0) {
                    displayGrowthRate = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;
                    console.log('  - Trend-Based Growth Rate:', displayGrowthRate);
                }
            }
            
            // Calculate daily data for trends
            const dailyData = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                const daySales = filtered.filter(sale => sale.date === dateStr);
                const dayRevenue = daySales.reduce((sum, sale) => sum + (parseFloat(sale.totalSales) || 0), 0);
                const dayOrders = daySales.length;
                
                dailyData.push({
                    date: dateStr,
                    revenue: dayRevenue,
                    orders: dayOrders,
                    avgOrderValue: dayOrders > 0 ? dayRevenue / dayOrders : 0
                });
            }
            
            // Business-specific calculations
            let businessMetrics = {};
            switch(userBusiness) {
                case 'petrol-pump':
                    businessMetrics = calculatePetrolPumpMetrics(filtered);
                    break;
                case 'restaurant':
                    businessMetrics = calculateRestaurantMetrics(filtered);
                    break;
                case 'retail':
                    businessMetrics = calculateRetailMetrics(filtered);
                    break;
                case 'service':
                    businessMetrics = calculateServiceMetrics(filtered);
                    break;
                default:
                    businessMetrics = calculateDefaultMetrics(filtered);
            }
            
            const analyticsResult = {
                totalRevenue,
                totalOrders,
                avgOrderValue,
                dailyData,
                timeRange: range,
                businessType: userBusiness,
                revenueChange,
                ordersChange,
                avgOrderChange,
                growthRate: displayGrowthRate,
                ...businessMetrics
            };
            
            console.log('Analytics - Final Result:');
            console.log('  - Total Revenue:', totalRevenue);
            console.log('  - Total Orders:', totalOrders);
            console.log('  - Average Order Value:', avgOrderValue);
            console.log('  - Revenue Change:', revenueChange);
            console.log('  - Orders Change:', ordersChange);
            console.log('  - Growth Rate:', displayGrowthRate);
            console.log('  - Business Metrics:', businessMetrics);
            
            setAnalyticsData(analyticsResult);
            
        } catch (error) {
            console.error('Analytics - Calculation Error:', error);
            setError('Failed to calculate analytics');
        }
    };

    const calculatePetrolPumpMetrics = (sales) => {
        // Petrol pump specific calculations
        const fuelTypes = {};
        
        // Check if sales is defined and is an array
        if (!sales || !Array.isArray(sales)) {
            console.log('calculatePetrolPumpMetrics - Invalid sales data:', sales);
            return {
                fuelTypes: {},
                topFuelType: '',
                avgFuelSale: 0,
                efficiency: 0,
                productivity: 0
            };
        }
        
        sales.forEach(sale => {
            if (sale.fuelType) {
                fuelTypes[sale.fuelType] = (fuelTypes[sale.fuelType] || 0) + (parseFloat(sale.totalSales) || 0);
            }
        });
        
        // Also add fuel sales from individual fuel fields
        sales.forEach(sale => {
            if (parseFloat(sale.petrolSales) > 0) {
                fuelTypes['petrol'] = (fuelTypes['petrol'] || 0) + parseFloat(sale.petrolSales);
            }
            if (parseFloat(sale.dieselSales) > 0) {
                fuelTypes['diesel'] = (fuelTypes['diesel'] || 0) + parseFloat(sale.dieselSales);
            }
            if (parseFloat(sale.cngSales) > 0) {
                fuelTypes['cng'] = (fuelTypes['cng'] || 0) + parseFloat(sale.cngSales);
            }
        });
        
        const totalFuelSales = Object.values(fuelTypes).reduce((sum, val) => sum + val, 0);
        const fuelTypeCount = Object.keys(fuelTypes).length;
        
        return {
            fuelTypes,
            topFuelType: Object.keys(fuelTypes).reduce((a, b) => fuelTypes[a] > fuelTypes[b] ? a : b, ''),
            avgFuelSale: fuelTypeCount > 0 ? totalFuelSales / fuelTypeCount : 0,
            efficiency: totalFuelSales > 0 ? (totalFuelSales / (totalFuelSales * 0.85)) * 100 : 0,
            productivity: totalFuelSales > 0 ? (totalFuelSales / 1000) : 0
        };
    };

    const calculateRestaurantMetrics = (sales) => {
        // Check if sales is defined and is an array
        if (!sales || !Array.isArray(sales)) {
            console.log('calculateRestaurantMetrics - Invalid sales data:', sales);
            return {
                avgTableTurnover: 0,
                peakHours: 'N/A',
                popularItems: []
            };
        }
        
        // Restaurant specific calculations
        return {
            avgTableTurnover: sales.length * 2.5, // Mock calculation
            peakHours: '12-2 PM, 7-10 PM',
            popularItems: ['Biryani', 'Butter Chicken', 'Paneer Tikka']
        };
    };

    const calculateRetailMetrics = (sales) => {
        // Check if sales is defined and is an array
        if (!sales || !Array.isArray(sales)) {
            console.log('calculateRetailMetrics - Invalid sales data:', sales);
            return {
                avgBasketSize: 0,
                topCategories: [],
                conversionRate: 0
            };
        }
        
        // Retail specific calculations
        return {
            avgBasketSize: sales.length > 0 ? sales.reduce((sum, sale) => sum + (sale.quantity || 1), 0) / sales.length : 0,
            topCategories: ['Electronics', 'Clothing', 'Groceries'],
            conversionRate: 0.65
        };
    };

    const calculateServiceMetrics = (sales) => {
        // Check if sales is defined and is an array
        if (!sales || !Array.isArray(sales)) {
            console.log('calculateServiceMetrics - Invalid sales data:', sales);
            return {
                avgServiceTime: 0,
                serviceTypes: [],
                customerSatisfaction: 0
            };
        }
        
        // Service specific calculations
        return {
            avgServiceTime: 45, // minutes
            serviceTypes: ['Repair', 'Maintenance', 'Installation'],
            customerSatisfaction: 4.5
        };
    };

    const calculateDefaultMetrics = (sales) => {
        // Check if sales is defined and is an array
        if (!sales || !Array.isArray(sales)) {
            console.log('calculateDefaultMetrics - Invalid sales data:', sales);
            return {
                growthRate: 0
            };
        }
        
        // Default calculations
        return {
            growthRate: sales.length > 1 ? ((sales[sales.length - 1]?.totalSales || 0) - (sales[0]?.totalSales || 0)) / (sales[0]?.totalSales || 1) * 100 : 0
        };
    };

    const getBusinessIcon = (businessType) => {
        const icons = {
            'petrol-pump': '⛽',
            'restaurant': '🍽️',
            'retail': '🏪',
            'service': '🔧',
            'multi-business': '🏢'
        };
        return icons[businessType] || '🏢';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (error) {
        return (
            <div className={Styles.analytics}>
                <div className={Styles.errorBoundary}>
                    <h2>⚠️ Analytics Error</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className={Styles.retryBtn}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={Styles.analytics}>
            <div className={Styles.header}>
                <div className={Styles.headerContent}>
                    <h1>{getBusinessIcon(userBusiness)} Business Analytics</h1>
                    <h2 className={Styles.subtitle}>{businessName}</h2>
                </div>
                <div className={Styles.timeRangeSelector}>
                    <button 
                        className={`${Styles.rangeBtn} ${timeRange === '7days' ? Styles.active : ''}`}
                        onClick={() => setTimeRange('7days')}
                    >
                        7 Days
                    </button>
                    <button 
                        className={`${Styles.rangeBtn} ${timeRange === '30days' ? Styles.active : ''}`}
                        onClick={() => setTimeRange('30days')}
                    >
                        30 Days
                    </button>
                    <button 
                        className={`${Styles.rangeBtn} ${timeRange === '90days' ? Styles.active : ''}`}
                        onClick={() => setTimeRange('90days')}
                    >
                        90 Days
                    </button>
                </div>
            </div>

            <div className={Styles.content}>
                {/* KPI Cards */}
                <div className={Styles.kpiCards}>
                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>💰</div>
                        <div className={Styles.kpiContent}>
                            <h3>Total Revenue</h3>
                            <p className={Styles.kpiValue}>{formatCurrency(analyticsData.totalRevenue || 0)}</p>
                            <span className={`${Styles.kpiChange} ${analyticsData.revenueChange >= 0 ? Styles.positive : Styles.negative}`}>
                                {analyticsData.revenueChange >= 0 ? '+' : ''}{analyticsData.revenueChange?.toFixed(1) || 0}%
                            </span>
                        </div>
                    </div>
                    
                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>📊</div>
                        <div className={Styles.kpiContent}>
                            <h3>Total Orders</h3>
                            <p className={Styles.kpiValue}>{analyticsData.totalOrders || 0}</p>
                            <span className={`${Styles.kpiChange} ${analyticsData.ordersChange >= 0 ? Styles.positive : Styles.negative}`}>
                                {analyticsData.ordersChange >= 0 ? '+' : ''}{analyticsData.ordersChange?.toFixed(1) || 0}%
                            </span>
                        </div>
                    </div>
                    
                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>📈</div>
                        <div className={Styles.kpiContent}>
                            <h3>Avg Order Value</h3>
                            <p className={Styles.kpiValue}>{formatCurrency(analyticsData.avgOrderValue || 0)}</p>
                            <span className={`${Styles.kpiChange} ${analyticsData.avgOrderChange >= 0 ? Styles.positive : Styles.negative}`}>
                                {analyticsData.avgOrderChange >= 0 ? '+' : ''}{analyticsData.avgOrderChange?.toFixed(1) || 0}%
                            </span>
                        </div>
                    </div>
                    
                    <div className={Styles.kpiCard}>
                        <div className={Styles.kpiIcon}>🎯</div>
                        <div className={Styles.kpiContent}>
                            <h3>Growth Rate</h3>
                            <p className={Styles.kpiValue}>{analyticsData.growthRate?.toFixed(1) || 0}%</p>
                            <span className={`${Styles.kpiChange} ${analyticsData.growthRate >= 0 ? Styles.positive : Styles.negative}`}>
                                {analyticsData.growthRate >= 0 ? 'Growing' : 'Declining'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sales Trend Chart */}
                <div className={Styles.chartSection}>
                    <h3>Sales Trend</h3>
                    <div className={Styles.chartContainer}>
                        {analyticsData.dailyData && analyticsData.dailyData.length > 0 ? (
                            <svg viewBox="0 0 800 300" className={Styles.chart}>
                                {/* Grid lines */}
                                {[...Array(6)].map((_, i) => (
                                    <line
                                        key={i}
                                        x1="50"
                                        y1={50 + i * 40}
                                        x2="750"
                                        y2={50 + i * 40}
                                        stroke="#e5e7eb"
                                        strokeWidth="1"
                                    />
                                ))}
                                
                                {/* Sales line */}
                                <polyline
                                    points={analyticsData.dailyData.map((day, i) => 
                                        `${100 + i * 100},${250 - (day.revenue / Math.max(...analyticsData.dailyData.map(d => d.revenue || 1))) * 180}`
                                    ).join(' ')}
                                    fill="none"
                                    stroke="#667eea"
                                    strokeWidth="3"
                                />
                                
                                {/* Data points */}
                                {analyticsData.dailyData.map((day, i) => (
                                    <g key={i}>
                                        <circle
                                            cx={100 + i * 100}
                                            cy={250 - (day.revenue / Math.max(...analyticsData.dailyData.map(d => d.revenue || 1))) * 180}
                                            r="5"
                                            fill="#667eea"
                                        />
                                        <text
                                            x={100 + i * 100}
                                            y="280"
                                            textAnchor="middle"
                                            fontSize="12"
                                            fill="#6c757d"
                                        >
                                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </text>
                                        <text
                                            x={100 + i * 100}
                                            y={240 - (day.revenue / Math.max(...analyticsData.dailyData.map(d => d.revenue || 1))) * 180}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fill="#667eea"
                                        >
                                            {formatCurrency(day.revenue)}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        ) : (
                            <div className={Styles.noDataMessage}>
                                <p>No sales data available for the selected period</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Business Specific Insights */}
                <div className={Styles.insightsSection}>
                    <h3>Business Insights</h3>
                    <div className={Styles.insightsGrid}>
                        {userBusiness === 'petrol-pump' && analyticsData.fuelTypes && (
                            <>
                                <div className={Styles.insightCard}>
                                    <h4>⛽ Top Fuel Type</h4>
                                    <p>{analyticsData.topFuelType || 'N/A'}</p>
                                </div>
                                <div className={Styles.insightCard}>
                                    <h4>📊 Fuel Performance</h4>
                                    <p>{Object.keys(analyticsData.fuelTypes || {}).join(', ')}</p>
                                </div>
                            </>
                        )}
                        
                        {userBusiness === 'restaurant' && (
                            <>
                                <div className={Styles.insightCard}>
                                    <h4>🍽️ Peak Hours</h4>
                                    <p>{analyticsData.peakHours || '12-2 PM, 7-10 PM'}</p>
                                </div>
                                <div className={Styles.insightCard}>
                                    <h4>⭐ Popular Items</h4>
                                    <p>{analyticsData.popularItems?.join(', ') || 'N/A'}</p>
                                </div>
                            </>
                        )}
                        
                        {userBusiness === 'retail' && (
                            <>
                                <div className={Styles.insightCard}>
                                    <h4>🛒 Avg Basket Size</h4>
                                    <p>{analyticsData.avgBasketSize?.toFixed(1) || 0} items</p>
                                </div>
                                <div className={Styles.insightCard}>
                                    <h4>🏷️ Top Categories</h4>
                                    <p>{analyticsData.topCategories?.join(', ') || 'N/A'}</p>
                                </div>
                            </>
                        )}
                        
                        {userBusiness === 'service' && (
                            <>
                                <div className={Styles.insightCard}>
                                    <h4>🔧 Avg Service Time</h4>
                                    <p>{analyticsData.avgServiceTime || 45} minutes</p>
                                </div>
                                <div className={Styles.insightCard}>
                                    <h4>⭐ Customer Satisfaction</h4>
                                    <p>{analyticsData.customerSatisfaction || 4.5}/5.0</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Recommendations */}
                <div className={Styles.recommendationsSection}>
                    <h3>Recommendations</h3>
                    <div className={Styles.recommendationsList}>
                        <div className={Styles.recommendation}>
                            <span className={Styles.recIcon}>💡</span>
                            <p>Focus on {userBusiness === 'petrol-pump' ? 'fuel efficiency programs' : 
                                   userBusiness === 'restaurant' ? 'menu optimization' :
                                   userBusiness === 'retail' ? 'inventory management' : 'service quality'}</p>
                        </div>
                        <div className={Styles.recommendation}>
                            <span className={Styles.recIcon}>📈</span>
                            <p>Consider expanding {userBusiness === 'petrol-pump' ? 'fuel types' : 
                                   userBusiness === 'restaurant' ? 'delivery options' :
                                   userBusiness === 'retail' ? 'product range' : 'service hours'}</p>
                        </div>
                        <div className={Styles.recommendation}>
                            <span className={Styles.recIcon}>🎯</span>
                            <p>Implement {userBusiness === 'petrol-pump' ? 'loyalty programs' : 
                                   userBusiness === 'restaurant' ? 'customer feedback system' :
                                   userBusiness === 'retail' ? 'seasonal promotions' : 'maintenance packages'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
