import { useState, useEffect } from 'react'
import Styles from '../styles/Dashboard.module.css'

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    // Load business name immediately
    loadBusinessName();
    loadRealData();
  }, []);

  const loadRealData = () => {
    // Get current user data
    const userData = localStorage.getItem('userData');
    if (!userData) return;
    
    const parsedUserData = JSON.parse(userData);
    const userId = parsedUserData.id || parsedUserData.userId;
    setCurrentUserId(userId);
    console.log('Dashboard - Loading data for userId:', userId);

    // Load sales data - filter by current user
    const allSales = JSON.parse(localStorage.getItem('salesData') || '[]');
    console.log('Dashboard - All Sales Data from localStorage:', allSales);
    const sales = allSales.filter(sale => sale.userId === userId);
    console.log('Dashboard - User Sales Data after filtering:', sales);
    setSalesData(sales);

    // Load stock data - filter by current user
    const allStock = JSON.parse(localStorage.getItem('stockData') || '[]');
    console.log('Dashboard - All Stock Data from localStorage:', allStock);
    const stock = allStock.filter(stock => stock.userId === userId);
    console.log('Dashboard - User Stock Data after filtering:', stock);
    setStockData(stock);

    // Load and combine transactions - filter by current user
    const stockTransactions = JSON.parse(localStorage.getItem('stockTransactions') || '[]')
      .filter(trans => trans.userId === userId);
    
    // Convert sales to transactions
    const salesTransactions = sales.map(sale => ({
      id: sale.id || `sale-${Date.now()}`,
      type: 'sale',
      date: sale.date,
      description: `Sale to ${sale.customer || 'Customer'}`,
      amount: parseFloat(sale.totalSales) || 0,
      fuelType: sale.fuelType || 'N/A',
      quantity: sale.quantity || 0,
      userId: userId
    }));

    setRecentTransactions([...salesTransactions, ...stockTransactions].slice(0, 10));
  };

  const loadBusinessName = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const businessType = parsedData.businessType;
      
      // Debug logging
      console.log('Dashboard - Business Type:', businessType);
      console.log('Dashboard - Business Name from data:', parsedData.businessName);
      console.log('Dashboard - Pump Name:', parsedData.pumpName);
      console.log('Dashboard - Restaurant Name:', parsedData.restaurantName);
      
      // Set business name based on business type
      let businessName = parsedData.businessName;
      
      // If no businessName, try specific field names
      if (!businessName) {
        switch(businessType) {
          case 'petrol-pump':
            businessName = parsedData.pumpName || parsedData.businessName || 'My Petrol Pump';
            break;
          case 'restaurant':
            businessName = parsedData.restaurantName || parsedData.businessName || 'My Restaurant';
            break;
          case 'retail':
            businessName = parsedData.retailName || parsedData.businessName || 'My Retail Store';
            break;
          case 'service':
            businessName = parsedData.serviceName || parsedData.businessName || 'My Service Center';
            break;
          default:
            businessName = parsedData.businessName || 'My Business';
        }
      }
      
      // Final fallback
      if (!businessName) {
        switch(businessType) {
          case 'petrol-pump':
            businessName = 'My Petrol Pump';
            break;
          case 'restaurant':
            businessName = 'My Restaurant';
            break;
          case 'retail':
            businessName = 'My Retail Store';
            break;
          case 'service':
            businessName = 'My Service Center';
            break;
          default:
            businessName = 'My Business';
        }
      }
      
      // Debug logging
      console.log('Dashboard - Final Business Name:', businessName);
      console.log('Dashboard - User Data:', parsedData);
      
      setBusinessName(businessName);
    } else {
      console.log('Dashboard - No user data found');
      setBusinessName('My Business');
    }
  };
  const calculateTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    console.log('Dashboard - Today Date:', today);
    console.log('Dashboard - All Sales Data:', salesData);
    
    const todaySales = salesData.filter(sale => sale.date === today);
    console.log('Dashboard - Today Sales Filtered:', todaySales);
    
    const total = todaySales.reduce((sum, sale) => sum + (parseFloat(sale.totalSales) || 0), 0);
    console.log('Dashboard - Today Sales Total:', total);
    
    return total;
  };

  const calculateMonthSales = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSales = salesData.filter(sale => new Date(sale.date) >= monthStart);
    return monthSales.reduce((sum, sale) => sum + (parseFloat(sale.totalSales) || 0), 0);
  };

  const todaySales = calculateTodaySales();
  const monthSales = calculateMonthSales();
  const totalTransactions = salesData.length;

  const businessKpiData = [
    { title: 'Today Sales', value: `₹${todaySales.toFixed(0)}`, change: '+12%', icon: '⛽', business: 'petrol' },
    { title: 'Month Sales', value: `₹${monthSales.toFixed(0)}`, change: '+8%', icon: '📊', business: 'restaurant' },
    { title: 'Total Transactions', value: totalTransactions, change: '+15%', icon: '📋', business: 'retail' },
    { title: 'Stock Value', value: `₹${stockData.reduce((sum, s) => sum + (s.currentStock * s.pricePerLiter), 0).toFixed(0)}`, change: '+5%', icon: '📦', business: 'service' }
  ];

  const fuelTypes = stockData.map(fuel => ({
    type: fuel.fuelType,
    sales: `₹${(fuel.totalSold * fuel.pricePerLiter).toFixed(0)}`,
    stock: `${fuel.currentStock.toFixed(0)}L`,
    rate: `₹${fuel.pricePerLiter}/L`,
    percentage: (fuel.currentStock / fuel.maxStock * 100).toFixed(0)
  }));

  const businessOverview = [
    { 
      business: 'Petrol Pump', 
      today: `₹${todaySales.toFixed(0)}`, 
      month: `₹${monthSales.toFixed(0)}`, 
      customers: totalTransactions, 
      status: 'Active' 
    }
  ];

  const inventoryAlerts = stockData
    .filter(stock => stock.status === 'warning' || stock.status === 'critical')
    .map(stock => ({
      item: `${stock.fuelType} Stock`,
      business: 'Petrol Pump',
      current: `${stock.currentStock.toFixed(0)}L`,
      min: `${stock.minStock}L`,
      status: stock.status
    }));

  return (
    <div className={Styles.dashboard}>
      {/* Business KPI Cards Row */}
      <div className={Styles.kpiSection}>
        <div className={Styles.header}>
          <div>
            <h1 className={Styles.sectionTitle}>{businessName || 'My Business'}</h1>
            <p className={Styles.subtitle}>Multi-Business Overview</p>
          </div>
        </div>
        <div className={Styles.kpiCards}>
          {businessKpiData.map((kpi, index) => (
            <div key={index} className={Styles.kpiCard}>
              <div className={Styles.kpiIcon}>{kpi.icon}</div>
              <div className={Styles.kpiContent}>
                <h3 className={Styles.kpiTitle}>{kpi.title}</h3>
                <p className={Styles.kpiValue}>{kpi.value}</p>
                <span className={`${Styles.kpiChange} ${kpi.change.startsWith('+') ? Styles.positive : Styles.negative}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Performance & Fuel Stock Row */}
      <div className={Styles.chartsSection}>
        <div className={Styles.chartContainer}>
          <h3 className={Styles.chartTitle}>Business Performance</h3>
          <div className={Styles.businessGrid}>
            {businessOverview.map((business, index) => (
              <div key={index} className={Styles.businessCard}>
                <div className={Styles.businessHeader}>
                  <span className={Styles.businessName}>{business.business}</span>
                  <span className={`${Styles.businessStatus} ${Styles[business.status.toLowerCase()]}`}>
                    {business.status}
                  </span>
                </div>
                <div className={Styles.businessMetrics}>
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Today:</span>
                    <span className={Styles.metricValue}>{business.today}</span>
                  </div>
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Month:</span>
                    <span className={Styles.metricValue}>{business.month}</span>
                  </div>
                  <div className={Styles.metric}>
                    <span className={Styles.metricLabel}>Customers:</span>
                    <span className={Styles.metricValue}>{business.customers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={Styles.chartContainer}>
          <h3 className={Styles.chartTitle}>Petrol Pump Stock Levels</h3>
          <div className={Styles.stockLevels}>
            {fuelTypes.map((fuel, index) => (
              <div key={index} className={Styles.stockItem}>
                <div className={Styles.stockHeader}>
                  <span className={Styles.fuelType}>{fuel.type}</span>
                  <span className={Styles.stockValue}>{fuel.stock}</span>
                </div>
                <div className={Styles.progressBar}>
                  <div className={Styles.progress} style={{width: `${fuel.percentage}%`}}></div>
                </div>
                <div className={Styles.stockDetails}>
                  <span>Sales: {fuel.sales}</span>
                  <span>Rate: {fuel.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className={Styles.tableSection}>
        <h2 className={Styles.sectionTitle}>Recent Transactions (All Businesses)</h2>
        <div className={Styles.tableContainer}>
          <table className={Styles.customerTable}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Business</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.time}</td>
                  <td>
                    <span className={`${Styles.businessBadge} ${Styles[transaction.business.toLowerCase().replace(' ', '')]}`}>
                      {transaction.business}
                    </span>
                  </td>
                  <td>{transaction.type}</td>
                  <td className={Styles.amount}>{transaction.amount}</td>
                  <td>{transaction.customer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className={Styles.tasksSection}>
        <h2 className={Styles.sectionTitle}>Inventory Alerts</h2>
        <div className={Styles.alertGrid}>
          {inventoryAlerts.map((alert, index) => (
            <div key={index} className={Styles.alertCard}>
              <div className={Styles.alertHeader}>
                <h4 className={Styles.alertItem}>{alert.item}</h4>
                <span className={`${Styles.alertStatus} ${Styles[alert.status]}`}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
              <div className={Styles.alertDetails}>
                <div className={Styles.alertMetric}>
                  <span className={Styles.alertLabel}>Business:</span>
                  <span className={Styles.alertValue}>{alert.business}</span>
                </div>
                <div className={Styles.alertMetric}>
                  <span className={Styles.alertLabel}>Current:</span>
                  <span className={Styles.alertValue}>{alert.current}</span>
                </div>
                <div className={Styles.alertMetric}>
                  <span className={Styles.alertLabel}>Min Level:</span>
                  <span className={Styles.alertValue}>{alert.min}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
