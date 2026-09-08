import { useState, useEffect } from 'react'
import Styles from '../styles/RestaurantStockManagement.module.css'

const RestaurantStockManagement = () => {
    const [stockItems, setStockItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newStockItem, setNewStockItem] = useState({
        name: '',
        category: '',
        currentStock: 0,
        unit: 'kg',
        minLevel: 10,
        supplier: '',
        price: 0,
        lastUpdated: new Date().toISOString()
    });
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        items: []
    });
    const [purchaseEntry, setPurchaseEntry] = useState({
        itemName: '',
        quantity: 0,
        unit: 'kg',
        supplier: '',
        costPerUnit: 0,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadStockItems();
        loadSuppliers();
        checkLowStock();
    }, []);

    const loadStockItems = () => {
        const savedStock = localStorage.getItem('restaurantStock');
        if (savedStock) {
            setStockItems(JSON.parse(savedStock));
        } else {
            // Sample stock items
            const sampleStock = [
                { id: 1, name: 'Rice', category: 'Grains', currentStock: 50, unit: 'kg', minLevel: 20, supplier: 'Supplier A', price: 60, lastUpdated: new Date().toISOString() },
                { id: 2, name: 'Vegetables', category: 'Vegetables', currentStock: 15, unit: 'kg', minLevel: 25, supplier: 'Supplier B', price: 40, lastUpdated: new Date().toISOString() },
                { id: 3, name: 'Cooking Oil', category: 'Oils', currentStock: 8, unit: 'ltr', minLevel: 10, supplier: 'Supplier C', price: 120, lastUpdated: new Date().toISOString() },
                { id: 4, name: 'Flour', category: 'Grains', currentStock: 30, unit: 'kg', minLevel: 15, supplier: 'Supplier A', price: 45, lastUpdated: new Date().toISOString() },
                { id: 5, name: 'Spices', category: 'Spices', currentStock: 5, unit: 'kg', minLevel: 8, supplier: 'Supplier D', price: 200, lastUpdated: new Date().toISOString() }
            ];
            setStockItems(sampleStock);
        }
    };

    const loadSuppliers = () => {
        const savedSuppliers = localStorage.getItem('restaurantSuppliers');
        if (savedSuppliers) {
            setSuppliers(JSON.parse(savedSuppliers));
        } else {
            // Sample suppliers
            const sampleSuppliers = [
                { id: 1, name: 'Supplier A', phone: '9876543210', email: 'supplierA@email.com', address: '123 Market St', items: ['Rice', 'Flour'] },
                { id: 2, name: 'Supplier B', phone: '9876543211', email: 'supplierB@email.com', address: '456 Market Ave', items: ['Vegetables'] },
                { id: 3, name: 'Supplier C', phone: '9876543212', email: 'supplierC@email.com', address: '789 Supply Rd', items: ['Cooking Oil'] }
            ];
            setSuppliers(sampleSuppliers);
        }
    };

    const checkLowStock = () => {
        const lowItems = stockItems.filter(item => item.currentStock <= item.minLevel);
        setLowStockAlerts(lowItems);
    };

    const saveStockItems = (items) => {
        setStockItems(items);
        localStorage.setItem('restaurantStock', JSON.stringify(items));
        checkLowStock();
    };

    const saveSuppliers = (supps) => {
        setSuppliers(supps);
        localStorage.setItem('restaurantSuppliers', JSON.stringify(supps));
    };

    const addStockItem = () => {
        if (newStockItem.name && newStockItem.category) {
            // Get current user ID
            const userData = localStorage.getItem('userData');
            const userId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : null;

            // Get default values from settings
            const getDefaultValues = () => {
                const businessSettings = localStorage.getItem('businessSettings');
                if (businessSettings) {
                    const settings = JSON.parse(businessSettings);
                    if (settings.defaultStockValues) {
                        return settings.defaultStockValues;
                    }
                }
                
                // Fallback defaults
                return {
                    defaultUnit: 'kg',
                    defaultMinLevel: 10
                };
            };

            const defaults = getDefaultValues();

            const item = {
                id: Date.now(),
                userId: userId,
                ...newStockItem,
                currentStock: parseFloat(newStockItem.currentStock),
                minLevel: parseFloat(newStockItem.minLevel || defaults.defaultMinLevel),
                unit: newStockItem.unit || defaults.defaultUnit,
                price: parseFloat(newStockItem.price || 0)
            };
            saveStockItems([...stockItems, item]);
            
            // Reset form with dynamic defaults
            setNewStockItem({
                name: '',
                category: '',
                currentStock: 0,
                unit: defaults.defaultUnit,
                minLevel: defaults.defaultMinLevel,
                supplier: '',
                price: 0,
                lastUpdated: new Date().toISOString()
            });
        }
    };

    const updateStock = (id, newQuantity, type = 'stockIn') => {
        const updatedItems = stockItems.map(item => {
            if (item.id === id) {
                const updatedQuantity = type === 'stockIn' 
                    ? item.currentStock + newQuantity
                    : item.currentStock - newQuantity;
                return {
                    ...item,
                    currentStock: Math.max(0, updatedQuantity),
                    lastUpdated: new Date().toISOString()
                };
            }
            return item;
        });
        saveStockItems(updatedItems);
    };

    const deleteStockItem = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            saveStockItems(stockItems.filter(item => item.id !== id));
        }
    };

    const addSupplier = () => {
        if (newSupplier.name && newSupplier.phone) {
            const supplier = {
                id: Date.now(),
                ...newSupplier,
                items: newSupplier.items.split(',').map(item => item.trim()).filter(item => item)
            };
            saveSuppliers([...suppliers, supplier]);
            setNewSupplier({
                name: '',
                phone: '',
                email: '',
                address: '',
                items: []
            });
        }
    };

    const deleteSupplier = (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            saveSuppliers(suppliers.filter(supplier => supplier.id !== id));
        }
    };

    const addPurchaseEntry = () => {
        if (purchaseEntry.itemName && purchaseEntry.quantity > 0) {
            const existingItem = stockItems.find(item => item.name === purchaseEntry.itemName);
            if (existingItem) {
                updateStock(existingItem.id, purchaseEntry.quantity, 'stockIn');
            } else {
                const newItem = {
                    id: Date.now(),
                    name: purchaseEntry.itemName,
                    category: 'General',
                    currentStock: purchaseEntry.quantity,
                    unit: purchaseEntry.unit,
                    minLevel: 10,
                    supplier: purchaseEntry.supplier,
                    price: parseFloat(purchaseEntry.costPerUnit),
                    lastUpdated: new Date().toISOString()
                };
                saveStockItems([...stockItems, newItem]);
            }

            const purchases = JSON.parse(localStorage.getItem('restaurantPurchases') || '[]');
            const purchase = {
                id: Date.now(),
                ...purchaseEntry,
                quantity: parseFloat(purchaseEntry.quantity),
                costPerUnit: parseFloat(purchaseEntry.costPerUnit),
                totalCost: purchaseEntry.quantity * purchaseEntry.costPerUnit,
                timestamp: new Date().toISOString()
            };
            purchases.push(purchase);
            localStorage.setItem('restaurantPurchases', JSON.stringify(purchases));

            // Add to expenses
            const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            const expenseEntry = {
                id: Date.now() + 1,
                category: 'supplies',
                amount: purchase.totalCost,
                description: `Purchased ${purchaseEntry.quantity} ${purchaseEntry.unit} of ${purchaseEntry.itemName} from ${purchaseEntry.supplier}`,
                date: purchaseEntry.date
            };
            expenses.push(expenseEntry);
            localStorage.setItem('expenses', JSON.stringify(expenses));

            setPurchaseEntry({
                itemName: '',
                quantity: 0,
                unit: 'kg',
                supplier: '',
                costPerUnit: 0,
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    const getStockStatus = (item) => {
        if (item.currentStock === 0) return { status: 'out', color: '#dc3545', text: 'Out of Stock' };
        if (item.currentStock <= item.minLevel) return { status: 'low', color: '#ffc107', text: 'Low Stock' };
        return { status: 'good', color: '#28a745', text: 'In Stock' };
    };

    const categories = [...new Set(stockItems.map(item => item.category))];

    return (
        <div className={Styles.stockManagement}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>📦 Stock & Inventory Management</h1>
                    <div className={Styles.stats}>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{stockItems.length}</span>
                            <span className={Styles.statLabel}>Total Items</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{lowStockAlerts.length}</span>
                            <span className={Styles.statLabel}>Low Stock</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{suppliers.length}</span>
                            <span className={Styles.statLabel}>Suppliers</span>
                        </div>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                {lowStockAlerts.length > 0 && (
                    <div className={Styles.alertSection}>
                        <h2>⚠️ Low Stock Alerts</h2>
                        <div className={Styles.alertsGrid}>
                            {lowStockAlerts.map(item => {
                                const status = getStockStatus(item);
                                return (
                                    <div key={item.id} className={Styles.alertCard}>
                                        <div className={Styles.alertIcon}>⚠️</div>
                                        <div className={Styles.alertContent}>
                                            <h4>{item.name}</h4>
                                            <p>Current: {item.currentStock} {item.unit}</p>
                                            <p>Min Level: {item.minLevel} {item.unit}</p>
                                            <p>Supplier: {item.supplier}</p>
                                        </div>
                                        <button 
                                            className={Styles.quickOrderBtn}
                                            onClick={() => setPurchaseEntry({...purchaseEntry, itemName: item.name, supplier: item.supplier})}
                                        >
                                            Quick Order
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className={Styles.tabs}>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'inventory' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        📦 Inventory
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'suppliers' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('suppliers')}
                    >
                        🚚 Suppliers
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'purchase' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('purchase')}
                    >
                        📝 Purchase Entry
                    </button>
                </div>

                {/* Inventory Management */}
                {activeTab === 'inventory' && (
                    <div className={Styles.inventorySection}>
                        <div className={Styles.formSection}>
                            <h2>➡️ Filter by Category</h2>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={Styles.select}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className={Styles.formSection}>
                            <h2>➕ Add Stock Item</h2>
                            <div className={Styles.itemForm}>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Item Name"
                                        value={newStockItem.name}
                                        onChange={(e) => setNewStockItem({...newStockItem, name: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <select
                                        value={newStockItem.category}
                                        onChange={(e) => setNewStockItem({...newStockItem, category: e.target.value})}
                                        className={Styles.input}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Grains">Grains (Rice, Wheat, Flour)</option>
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Oils">Oils & Ghee</option>
                                        <option value="Spices">Spices</option>
                                        <option value="Dairy">Dairy Products</option>
                                        <option value="Beverages">Beverages</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Current Stock"
                                        value={newStockItem.currentStock}
                                        onChange={(e) => setNewStockItem({...newStockItem, currentStock: e.target.value})}
                                        className={Styles.input}
                                        min="0"
                                    />
                                </div>
                                <div className={Styles.formRow}>
                                    <input
                                        type="number"
                                        placeholder="Price per Unit (₹)"
                                        value={newStockItem.price}
                                        onChange={(e) => setNewStockItem({...newStockItem, price: e.target.value})}
                                        className={Styles.input}
                                        min="0"
                                        step="0.01"
                                    />
                                    <select
                                        value={newStockItem.unit}
                                        onChange={(e) => setNewStockItem({...newStockItem, unit: e.target.value})}
                                        className={Styles.select}
                                    >
                                        <option value="kg">Kilograms</option>
                                        <option value="ltr">Liters</option>
                                        <option value="pcs">Pieces</option>
                                        <option value="boxes">Boxes</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Min Level"
                                        value={newStockItem.minLevel}
                                        onChange={(e) => setNewStockItem({...newStockItem, minLevel: e.target.value})}
                                        className={Styles.input}
                                        min="0"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Supplier"
                                        value={newStockItem.supplier}
                                        onChange={(e) => setNewStockItem({...newStockItem, supplier: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <button className={Styles.addBtn} onClick={addStockItem}>
                                    ➕ Add Item
                                </button>
                            </div>
                        </div>

                        <div className={Styles.itemsGrid}>
                            {stockItems.filter(item => selectedCategory === 'all' || item.category === selectedCategory).map(item => {
                                const status = getStockStatus(item);
                                return (
                                    <div key={item.id} className={Styles.stockCard}>
                                        <div className={Styles.stockHeader}>
                                            <h3>{item.name}</h3>
                                            <span className={`${Styles.statusBadge} ${Styles[status.status]}`}>
                                                {status.text}
                                            </span>
                                        </div>
                                        <div className={Styles.stockDetails}>
                                            <div className={Styles.detailRow}>
                                                <span>Category:</span>
                                                <span>{item.category}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span>Current Stock:</span>
                                                <span className={Styles.stockValue}>{item.currentStock} {item.unit}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span>Price per Unit:</span>
                                                <span className={Styles.priceValue}>₹{item.price ? item.price.toFixed(2) : '0.00'}/{item.unit}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span>Total Value:</span>
                                                <span className={Styles.totalValue}>₹{((item.price || 0) * item.currentStock).toFixed(2)}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span>Min Level:</span>
                                                <span>{item.minLevel} {item.unit}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span>Supplier:</span>
                                                <span>{item.supplier}</span>
                                            </div>
                                        </div>
                                        <div className={Styles.stockActions}>
                                            <div className={Styles.stockControls}>
                                                <button 
                                                    className={Styles.stockBtn}
                                                    onClick={() => updateStock(item.id, 1, 'stockIn')}
                                                >
                                                    + Stock In
                                                </button>
                                                <button 
                                                    className={Styles.stockBtn}
                                                    onClick={() => updateStock(item.id, 1, 'stockOut')}
                                                >
                                                    - Stock Out
                                                </button>
                                            </div>
                                            <button 
                                                className={Styles.deleteBtn}
                                                onClick={() => deleteStockItem(item.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Suppliers Management */}
                {activeTab === 'suppliers' && (
                    <div className={Styles.suppliersSection}>
                        <div className={Styles.formSection}>
                            <h2>➕ Add Supplier</h2>
                            <div className={Styles.supplierForm}>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Supplier Name"
                                        value={newSupplier.name}
                                        onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={newSupplier.phone}
                                        onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <div className={Styles.formRow}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={newSupplier.email}
                                        onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={newSupplier.address}
                                        onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Items (comma separated)"
                                        value={newSupplier.items}
                                        onChange={(e) => setNewSupplier({...newSupplier, items: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <button className={Styles.addBtn} onClick={addSupplier}>
                                        ➕ Add Supplier
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={Styles.suppliersGrid}>
                            {suppliers.map(supplier => (
                                <div key={supplier.id} className={Styles.supplierCard}>
                                    <div className={Styles.supplierHeader}>
                                        <h3>{supplier.name}</h3>
                                        <button 
                                            className={Styles.deleteBtn}
                                            onClick={() => deleteSupplier(supplier.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div className={Styles.supplierDetails}>
                                        <p>📞 {supplier.phone}</p>
                                        <p>📧 {supplier.email}</p>
                                        <p>📍 {supplier.address}</p>
                                        <div className={Styles.supplierItems}>
                                            <strong>Items:</strong>
                                            <div className={Styles.itemsList}>
                                                {supplier.items.map((item, index) => (
                                                    <span key={index} className={Styles.itemTag}>{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Purchase Entry */}
                {activeTab === 'purchase' && (
                    <div className={Styles.purchaseSection}>
                        <div className={Styles.formSection}>
                            <h2>📝 Purchase Entry</h2>
                            <div className={Styles.purchaseForm}>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Item Name"
                                        value={purchaseEntry.itemName}
                                        onChange={(e) => setPurchaseEntry({...purchaseEntry, itemName: e.target.value})}
                                        className={Styles.input}
                                        list="itemsList"
                                    />
                                    <datalist id="itemsList">
                                        {stockItems.map(item => (
                                            <option key={item.id} value={item.name} />
                                        ))}
                                    </datalist>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={purchaseEntry.quantity}
                                        onChange={(e) => setPurchaseEntry({...purchaseEntry, quantity: e.target.value})}
                                        className={Styles.input}
                                        min="0"
                                    />
                                    <select
                                        value={purchaseEntry.unit}
                                        onChange={(e) => setPurchaseEntry({...purchaseEntry, unit: e.target.value})}
                                        className={Styles.select}
                                    >
                                        <option value="kg">Kilograms</option>
                                        <option value="ltr">Liters</option>
                                        <option value="pcs">Pieces</option>
                                        <option value="boxes">Boxes</option>
                                    </select>
                                </div>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Supplier"
                                        value={purchaseEntry.supplier}
                                        onChange={(e) => setPurchaseEntry({...purchaseEntry, supplier: e.target.value})}
                                        className={Styles.input}
                                        list="suppliersList"
                                    />
                                    <datalist id="suppliersList">
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.name} />
                                        ))}
                                    </datalist>
                                    <input
                                        type="number"
                                        placeholder="Cost per Unit"
                                        value={purchaseEntry.costPerUnit}
                                        onChange={(e) => setPurchaseEntry({...purchaseEntry, costPerUnit: e.target.value})}
                                        className={Styles.input}
                                        min="0"
                                        step="0.01"
                                    />
                                    <input
                                        type="date"
                                        value={purchaseEntry.date}
                                        onChange={(e) => setPurchaseEntry({...purchaseEntry, date: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <div className={Styles.purchaseSummary}>
                                    <div className={Styles.summaryRow}>
                                        <span>Total Cost:</span>
                                        <span className={Styles.totalCost}>
                                            ₹{(purchaseEntry.quantity * purchaseEntry.costPerUnit).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <button className={Styles.addBtn} onClick={addPurchaseEntry}>
                                    📝 Add Purchase Entry
                                </button>
                            </div>
                        </div>

                        {/* Purchase History */}
                        <div className={Styles.historySection}>
                            <h3>📋 Purchase History</h3>
                            <div className={Styles.historyGrid}>
                                {JSON.parse(localStorage.getItem('restaurantPurchases') || '[]').slice(-5).reverse().map(purchase => (
                                    <div key={purchase.id} className={Styles.purchaseCard}>
                                        <div className={Styles.purchaseHeader}>
                                            <h4>{purchase.itemName}</h4>
                                            <span className={Styles.date}>
                                                {new Date(purchase.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className={Styles.purchaseDetails}>
                                            <p>Quantity: {purchase.quantity} {purchase.unit}</p>
                                            <p>Cost: ₹{purchase.costPerUnit}/{purchase.unit}</p>
                                            <p>Total: ₹{purchase.totalCost.toFixed(2)}</p>
                                            <p>Supplier: {purchase.supplier}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantStockManagement;
