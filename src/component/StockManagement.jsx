import { useState, useEffect } from 'react'
import Styles from '../styles/StockManagement.module.css'
import { PiCheckCircle, PiLightning, PiWarning } from 'react-icons/pi'

const StockManagement = () => {
    const [userBusiness, setUserBusiness] = useState('');
    const [stockData, setStockData] = useState([]);
    const [stockForm, setStockForm] = useState({
        fuelType: 'petrol',
        quantity: '',
        action: 'add',
        price: '',
        supplier: '',
        newCapacity: ''  // New field for tank capacity
    });
    const [showCapacityForm, setShowCapacityForm] = useState(false);
    const [capacityForm, setCapacityForm] = useState({
        fuelType: 'petrol',
        newMaxCapacity: '',
        newMinCapacity: '',
        newReorderLevel: ''
    });

    const getLabels = () => {
        if (userBusiness === 'retail' || userBusiness === 'restaurant') {
            return {
                title: 'Inventory Management',
                itemLabel: 'Product / Item Name',
                qtyLabel: 'Quantity (Units)',
                priceLabel: 'Price per Unit (₹)',
                capacityTitle: 'Inventory Threshold Settings',
                capacityBtn: 'Inventory Settings',
                updateCapacityBtn: 'Update Inventory Thresholds',
                unit: ' Units',
                capacityLabel: 'Max Stock Limit',
                minLabel: 'Min Alert Level',
                reorderLabel: 'Reorder Threshold'
            };
        } else if (userBusiness === 'service') {
            return {
                title: 'Parts & Stock Management',
                itemLabel: 'Part / Material Name',
                qtyLabel: 'Quantity (Units)',
                priceLabel: 'Price per Unit (₹)',
                capacityTitle: 'Parts Threshold Settings',
                capacityBtn: 'Stock Settings',
                updateCapacityBtn: 'Update Stock Thresholds',
                unit: ' Units',
                capacityLabel: 'Max Stock Limit',
                minLabel: 'Min Alert Level',
                reorderLabel: 'Reorder Threshold'
            };
        } else {
            return {
                title: 'Stock Management',
                itemLabel: 'Fuel Type',
                qtyLabel: 'Quantity (Liters)',
                priceLabel: 'Price per Liter (₹)',
                capacityTitle: 'Tank Capacity Settings',
                capacityBtn: 'Tank Settings',
                updateCapacityBtn: 'Update Tank Capacity',
                unit: 'L',
                capacityLabel: 'Max Capacity',
                minLabel: 'Min Level',
                reorderLabel: 'Reorder Level'
            };
        }
    };
    const labels = getLabels();

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserBusiness(parsedData.businessType);
        }

        loadStockData();
    }, []);

    useEffect(() => {
        if (stockData.length > 0) {
            setStockForm(prev => ({
                ...prev,
                fuelType: stockData[0].fuelType.toLowerCase()
            }));
            setCapacityForm(prev => ({
                ...prev,
                fuelType: stockData[0].fuelType.toLowerCase()
            }));
        }
    }, [stockData]);

    const loadStockData = () => {
        // Get current user data
        const userData = localStorage.getItem('userData');
        const userId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : null;
        
        const existingStock = localStorage.getItem('stockData');
        if (existingStock) {
            const allStock = JSON.parse(existingStock);
            const stock = userId ? allStock.filter(item => item.userId === userId) : allStock;
            
            if (stock.length === 0 && userId) {
                // Create initial stock for new user - get from settings or use defaults
                const getDefaultStockConfig = () => {
                    // Try to get from business settings
                    const businessSettings = localStorage.getItem('businessSettings');
                    if (businessSettings) {
                        const settings = JSON.parse(businessSettings);
                        if (settings.defaultStockConfig) {
                            return settings.defaultStockConfig;
                        }
                    }
                    
                    // Try to get from user data
                    const userData = localStorage.getItem('userData');
                    let businessType = 'petrol-pump';
                    if (userData) {
                        const parsedData = JSON.parse(userData);
                        businessType = parsedData.businessType;
                        if (parsedData.defaultStockConfig) {
                            return parsedData.defaultStockConfig;
                        }
                    }
                    
                    if (businessType === 'retail') {
                        return [
                            {
                                fuelType: 'Laptops',
                                currentStock: 15,
                                minStock: 5,
                                maxStock: 50,
                                reorderLevel: 10,
                                pricePerLiter: 45000.00
                            },
                            {
                                fuelType: 'Smartphones',
                                currentStock: 25,
                                minStock: 10,
                                maxStock: 80,
                                reorderLevel: 15,
                                pricePerLiter: 25000.00
                            },
                            {
                                fuelType: 'Accessories',
                                currentStock: 60,
                                minStock: 20,
                                maxStock: 200,
                                reorderLevel: 30,
                                pricePerLiter: 1500.00
                            }
                        ];
                    } else if (businessType === 'service') {
                        return [
                            {
                                fuelType: 'Engine Oil',
                                currentStock: 45,
                                minStock: 15,
                                maxStock: 150,
                                reorderLevel: 25,
                                pricePerLiter: 1200.00
                            },
                            {
                                fuelType: 'Brake Pads',
                                currentStock: 12,
                                minStock: 5,
                                maxStock: 40,
                                reorderLevel: 8,
                                pricePerLiter: 2400.00
                            },
                            {
                                fuelType: 'Spark Plugs',
                                currentStock: 30,
                                minStock: 10,
                                maxStock: 100,
                                reorderLevel: 20,
                                pricePerLiter: 450.00
                            }
                        ];
                    }
                    
                    // Fallback defaults
                    return [
                        {
                            fuelType: 'Petrol',
                            currentStock: 5000,
                            minStock: 2000,
                            maxStock: 10000,
                            reorderLevel: 3000,
                            pricePerLiter: 102.50
                        },
                        {
                            fuelType: 'Diesel',
                            currentStock: 3000,
                            minStock: 1500,
                            maxStock: 8000,
                            reorderLevel: 2000,
                            pricePerLiter: 89.75
                        },
                        {
                            fuelType: 'CNG',
                            currentStock: 2000,
                            minStock: 1000,
                            maxStock: 5000,
                            reorderLevel: 1500,
                            pricePerLiter: 65.00
                        }
                    ];
                };

                const stockConfig = getDefaultStockConfig();
                const initialStock = stockConfig.map((config, index) => ({
                    id: Date.now() + index,
                    userId: userId,
                    ...config,
                    lastUpdated: new Date().toISOString()
                }));
                
                updateStockStatus(initialStock);
                localStorage.setItem('stockData', JSON.stringify([...allStock, ...initialStock]));
            } else {
                updateStockStatus(stock);
            }
        }
    };

    const updateStockStatus = (stock) => {
        const updatedStock = stock.map(item => {
            let status = 'normal';
            if (item.currentStock <= item.minStock) {
                status = 'critical';
            } else if (item.currentStock <= item.reorderLevel) {
                status = 'warning';
            }
            return { ...item, status };
        });
        localStorage.setItem('stockData', JSON.stringify(updatedStock));
        setStockData(updatedStock);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStockForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const quantity = parseFloat(stockForm.quantity);
        const matchedItem = stockData.find(item => item.fuelType.toLowerCase() === stockForm.fuelType.toLowerCase());
        const fuelType = matchedItem ? matchedItem.fuelType : stockForm.fuelType;
        
        const updatedStock = stockData.map(item => {
            if (item.fuelType === fuelType) {
                let newStock = item.currentStock;
                
                if (stockForm.action === 'add') {
                    newStock += quantity;
                    if (newStock > item.maxStock) {
                        alert(`Warning: Stock exceeds maximum capacity of ${item.maxStock} ${labels.unit}`);
                        newStock = item.maxStock;
                    }
                } else {
                    newStock -= quantity;
                    if (newStock < 0) {
                        alert('Error: Cannot reduce stock below 0');
                        return item;
                    }
                }
                
                return {
                    ...item,
                    currentStock: newStock,
                    lastUpdated: new Date().toISOString().split('T')[0],
                    pricePerLiter: stockForm.price ? parseFloat(stockForm.price) : item.pricePerLiter
                };
            }
            return item;
        });

        updateStockStatus(updatedStock);
        
        const userData = localStorage.getItem('userData');
        const userId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : null;

        const transaction = {
            id: Date.now(),
            userId: userId, // isolation fix
            fuelType,
            action: stockForm.action,
            quantity,
            price: stockForm.price || 0,
            supplier: stockForm.supplier || 'N/A',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString()
        };
        
        const transactions = JSON.parse(localStorage.getItem('stockTransactions') || '[]');
        transactions.unshift(transaction);
        localStorage.setItem('stockTransactions', JSON.stringify(transactions.slice(0, 50)));

        setStockForm({
            fuelType: 'petrol',
            quantity: '',
            action: 'add',
            price: '',
            supplier: ''
        });

        alert(`Stock ${stockForm.action === 'add' ? 'added' : 'reduced'} successfully!`);
    };

    const updateTankCapacity = () => {
        if (!capacityForm.fuelType || !capacityForm.newMaxCapacity) {
            alert('Please select item type and enter new max capacity!');
            return;
        }

        const userData = localStorage.getItem('userData');
        const userId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : null;

        const matchedItem = stockData.find(item => item.fuelType.toLowerCase() === capacityForm.fuelType.toLowerCase());
        const fuelType = matchedItem ? matchedItem.fuelType : capacityForm.fuelType;

        const updatedStock = stockData.map(item => {
            if (item.fuelType === fuelType) {
                return {
                    ...item,
                    maxStock: parseFloat(capacityForm.newMaxCapacity),
                    minStock: capacityForm.newMinCapacity ? parseFloat(capacityForm.newMinCapacity) : item.minStock,
                    reorderLevel: capacityForm.newReorderLevel ? parseFloat(capacityForm.newReorderLevel) : item.reorderLevel,
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
            }
            return item;
        });

        // Update in localStorage
        const allStock = JSON.parse(localStorage.getItem('stockData') || '[]');
        const filteredAllStock = userId ? allStock.filter(item => item.userId === userId) : allStock;
        const otherUsersStock = userId ? allStock.filter(item => item.userId !== userId) : [];
        
        const updatedAllStock = [...otherUsersStock, ...updatedStock];
        localStorage.setItem('stockData', JSON.stringify(updatedAllStock));

        updateStockStatus(updatedStock);
        
        // Log the capacity change
        const capacityLog = {
            id: Date.now(),
            userId: userId,
            fuelType,
            action: 'capacity_update',
            oldMaxCapacity: stockData.find(item => item.fuelType === fuelType)?.maxStock || 0,
            newMaxCapacity: parseFloat(capacityForm.newMaxCapacity),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString()
        };

        const capacityLogs = JSON.parse(localStorage.getItem('capacityLogs') || '[]');
        capacityLogs.unshift(capacityLog);
        localStorage.setItem('capacityLogs', JSON.stringify(capacityLogs.slice(0, 100)));

        setCapacityForm({
            fuelType: 'petrol',
            newMaxCapacity: '',
            newMinCapacity: '',
            newReorderLevel: ''
        });
        setShowCapacityForm(false);
        alert(`Tank capacity for ${fuelType} updated successfully!`);
    };

    const handleCapacityInputChange = (e) => {
        const { name, value } = e.target;
        setCapacityForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'critical': return '#dc3545';
            case 'warning': return '#ffc107';
            case 'normal': return '#28a745';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'critical': return 'Critical Stock';
            case 'warning': return 'Low Stock';
            case 'normal': return 'Normal';
            default: return 'Unknown';
        }
    };

    const getStockPercentage = (current, max) => {
        return max > 0 ? (current / max * 100).toFixed(1) : 0;
    };

    return (
        <div className={Styles.stockManagement}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>{labels.title}</h1>
                    <div className={Styles.businessBadge}>
                        Business Type: <span>{userBusiness}</span>
                    </div>
                </div>

                {/* Stock Management Form */}
                <div className={Styles.formCard}>
                    <h2>Manage {labels.title}</h2>
                    <form onSubmit={handleSubmit} className={Styles.form}>
                        <div className={Styles.formRow}>
                            <div className={Styles.formGroup}>
                                <label htmlFor="fuelType">{labels.itemLabel}</label>
                                <select
                                    id="fuelType"
                                    name="fuelType"
                                    value={stockForm.fuelType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {stockData.map(item => (
                                        <option key={item.id} value={item.fuelType.toLowerCase()}>
                                            {item.fuelType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={Styles.formGroup}>
                                <label htmlFor="action">Action</label>
                                <select
                                    id="action"
                                    name="action"
                                    value={stockForm.action}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="add">Add Stock (Purchase)</option>
                                    <option value="reduce">Reduce Stock (Manual)</option>
                                </select>
                            </div>
                        </div>

                        <div className={Styles.formRow}>
                            <div className={Styles.formGroup}>
                                <label htmlFor="quantity">{labels.qtyLabel}</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    placeholder="Enter quantity"
                                    value={stockForm.quantity}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className={Styles.formGroup}>
                                <label htmlFor="price">{labels.priceLabel}</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    placeholder="Optional"
                                    value={stockForm.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className={Styles.formRow}>
                            <div className={Styles.formGroup}>
                                <label htmlFor="supplier">Supplier Name</label>
                                <input
                                    type="text"
                                    id="supplier"
                                    name="supplier"
                                    placeholder="Supplier name (optional)"
                                    value={stockForm.supplier}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className={Styles.formActions}>
                            <button type="submit" className={Styles.submitBtn}>
                                {stockForm.action === 'add' ? 'Add Stock' : 'Reduce Stock'}
                            </button>
                            <button 
                                type="button" 
                                className={Styles.capacityBtn}
                                onClick={() => setShowCapacityForm(!showCapacityForm)}
                            >
                                {showCapacityForm ? 'Cancel' : labels.capacityBtn}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tank Capacity Management Form */}
                {showCapacityForm && (
                    <div className={Styles.formCard}>
                        <h2>{labels.capacityTitle}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); updateTankCapacity(); }} className={Styles.form}>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="capacityFuelType">{labels.itemLabel}</label>
                                    <select
                                        id="capacityFuelType"
                                        name="fuelType"
                                        value={capacityForm.fuelType}
                                        onChange={handleCapacityInputChange}
                                        required
                                    >
                                        {stockData.map(item => (
                                            <option key={item.id} value={item.fuelType.toLowerCase()}>
                                                {item.fuelType}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="newMaxCapacity">New {labels.capacityLabel} ({labels.unit})</label>
                                    <input
                                        type="number"
                                        id="newMaxCapacity"
                                        name="newMaxCapacity"
                                        placeholder="Enter new max capacity"
                                        value={capacityForm.newMaxCapacity}
                                        onChange={handleCapacityInputChange}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="newMinCapacity">New {labels.minLabel} ({labels.unit})</label>
                                    <input
                                        type="number"
                                        id="newMinCapacity"
                                        name="newMinCapacity"
                                        placeholder="Optional: Update min level"
                                        value={capacityForm.newMinCapacity}
                                        onChange={handleCapacityInputChange}
                                        min="0"
                                    />
                                </div>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="newReorderLevel">New {labels.reorderLabel} ({labels.unit})</label>
                                    <input
                                        type="number"
                                        id="newReorderLevel"
                                        name="newReorderLevel"
                                        placeholder="Optional: Update reorder level"
                                        value={capacityForm.newReorderLevel}
                                        onChange={handleCapacityInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className={Styles.capacityInfo}>
                                <p><strong>Current Settings:</strong></p>
                                {stockData
                                    .filter(item => item.fuelType.toLowerCase() === capacityForm.fuelType)
                                    .map(item => (
                                        <div key={item.id} className={Styles.currentSettings}>
                                            <span>Max: {item.maxStock}{labels.unit} | Min: {item.minStock}{labels.unit} | Reorder: {item.reorderLevel}{labels.unit}</span>
                                        </div>
                                    ))}
                            </div>

                            <div className={Styles.formActions}>
                                <button type="submit" className={Styles.updateCapacityBtn}>
                                    {labels.updateCapacityBtn}
                                </button>
                                <button 
                                    type="button" 
                                    className={Styles.cancelBtn}
                                    onClick={() => setShowCapacityForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Current Stock Overview */}
                <div className={Styles.stockGrid}>
                    <h2>Current {labels.title} Overview</h2>
                    {stockData.map(item => (
                        <div key={item.id} className={Styles.stockCard}>
                            <div className={Styles.stockHeader}>
                                <h3>{item.fuelType}</h3>
                                <span 
                                    className={Styles.statusBadge}
                                    style={{ backgroundColor: getStatusColor(item.status) }}
                                >
                                    {getStatusText(item.status)}
                                </span>
                            </div>
                            
                            <div className={Styles.stockInfo}>
                                <div className={Styles.stockMetric}>
                                    <span className={Styles.label}>Available</span>
                                    <span className={Styles.value}>{(item.currentStock || 0).toFixed(2)}{labels.unit}</span>
                                </div>
                                <div className={Styles.stockMetric}>
                                    <span className={Styles.label}>Capacity</span>
                                    <span className={Styles.value}>{item.maxStock || 0}{labels.unit}</span>
                                </div>
                                <div className={Styles.stockMetric}>
                                    <span className={Styles.label}>Price</span>
                                    <span className={Styles.value}>₹{(item.pricePerLiter || 0).toFixed(2)}/{labels.unit === 'L' ? 'L' : 'Unit'}</span>
                                </div>
                            </div>

                            <div className={Styles.stockBar}>
                                <div className={Styles.barBackground}>
                                    <div 
                                        className={Styles.barFill}
                                        style={{ 
                                            width: `${getStockPercentage(item.currentStock, item.maxStock)}%`,
                                            backgroundColor: getStatusColor(item.status)
                                        }}
                                    ></div>
                                </div>
                                <div className={Styles.barMarkers}>
                                    <div className={Styles.marker} style={{ left: '0%' }}>Empty</div>
                                    <div className={Styles.marker} style={{ left: `${(item.minStock / item.maxStock * 100)}%` }}>Min</div>
                                    <div className={Styles.marker} style={{ left: `${(item.reorderLevel / item.maxStock * 100)}%` }}>Reorder</div>
                                    <div className={Styles.marker} style={{ left: '100%' }}>Full</div>
                                </div>
                            </div>

                            <div className={Styles.stockDetails}>
                                <div className={Styles.detailRow}>
                                    <span>Min Level:</span>
                                    <span>{item.minStock || 0}{labels.unit}</span>
                                </div>
                                <div className={Styles.detailRow}>
                                    <span>Reorder At:</span>
                                    <span>{item.reorderLevel || 0}{labels.unit}</span>
                                </div>
                                <div className={Styles.detailRow}>
                                    <span>Stock Value:</span>
                                    <span>₹{((item.currentStock || 0) * (item.pricePerLiter || 0)).toFixed(2)}</span>
                                </div>
                                <div className={Styles.detailRow}>
                                    <span>Last Updated:</span>
                                    <span>{item.lastUpdated || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stock Alerts */}
                <div className={Styles.alertsSection}>
                    <h2>Stock Alerts</h2>
                    <div className={Styles.alertsGrid}>
                        {stockData.filter(item => item.status !== 'normal').map(item => (
                            <div key={item.id} className={Styles.alertCard}>
                                <div className={Styles.alertIcon}>
                                    {item.status === 'critical' ? <PiWarning aria-hidden="true" /> : <PiLightning aria-hidden="true" />}
                                </div>
                                <div className={Styles.alertContent}>
                                    <h4>{item.fuelType} - {getStatusText(item.status)}</h4>
                                    <p>
                                        {item.status === 'critical' ? 
                                            `Critical: Only ${(item.currentStock || 0).toFixed(2)}${labels.unit} remaining. Immediate refill required!` :
                                            `Low: ${(item.currentStock || 0).toFixed(2)}${labels.unit} remaining. Consider reordering soon.`
                                        }
                                    </p>
                                    <button className={Styles.alertBtn}>
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        ))}
                        {stockData.filter(item => item.status === 'normal').length === stockData.length && (
                            <div className={Styles.noAlerts}>
                                <div className={Styles.successIcon}><PiCheckCircle aria-hidden="true" /></div>
                                <p>All stock levels are normal. No immediate action required.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockManagement;
