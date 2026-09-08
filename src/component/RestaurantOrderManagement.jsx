import { useState, useEffect } from 'react'
import Styles from '../styles/RestaurantOrderManagement.module.css'

const RestaurantOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [orderTypeFilter, setOrderTypeFilter] = useState('all');
    const [showNewOrderForm, setShowNewOrderForm] = useState(false);
    const [newOrder, setNewOrder] = useState({
        customerName: '',
        customerPhone: '',
        tableNumber: '',
        orderType: 'dine-in'
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadOrders();
        loadTables();
        loadCustomers();
        loadMenuItems();
    }, []);

    const loadOrders = () => {
        const savedOrders = localStorage.getItem('restaurantOrders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    };

    const loadTables = () => {
        const savedTables = localStorage.getItem('restaurantTables');
        if (savedTables) {
            setTables(JSON.parse(savedTables));
        }
    };

    const loadCustomers = () => {
        const saved = localStorage.getItem('restaurantCustomers');
        if (saved) {
            setCustomers(JSON.parse(saved));
        }
    };

    const loadMenuItems = () => {
        const savedMenu = localStorage.getItem('restaurantMenu');
        if (savedMenu) {
            setMenuItems(JSON.parse(savedMenu));
        }
    };

    const categories = ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))];
    
    const filteredMenuItems = selectedCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);

    const addItemToOrder = (item) => {
        const existing = selectedItems.find(i => i.id === item.id);
        if (existing) {
            setSelectedItems(selectedItems.map(i => 
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ));
        } else {
            setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
        }
    };

    const updateItemQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            setSelectedItems(selectedItems.filter(i => i.id !== itemId));
        } else {
            setSelectedItems(selectedItems.map(i => 
                i.id === itemId ? { ...i, quantity } : i
            ));
        }
    };

    const calculateTotal = () => {
        return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const createOrder = () => {
        if (!newOrder.customerName || !newOrder.customerPhone || selectedItems.length === 0) {
            alert('Please fill customer details and add items!');
            return;
        }

        // Get current user ID
        const userData = localStorage.getItem('userData');
        const userId = userData ? JSON.parse(userData).id || JSON.parse(userData).userId : null;

        const order = {
            id: Date.now(),
            userId: userId,
            customerName: newOrder.customerName,
            customerPhone: newOrder.customerPhone,
            tableNumber: newOrder.tableNumber,
            items: selectedItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            orderType: newOrder.orderType,
            status: 'preparing',
            totalAmount: calculateTotal(),
            createdAt: new Date().toISOString()
        };

        const updatedOrders = [...orders, order];
        setOrders(updatedOrders);
        localStorage.setItem('restaurantOrders', JSON.stringify(updatedOrders));

        // Update or create customer
        const customerIndex = customers.findIndex(c => c.phone === newOrder.customerPhone);
        let updatedCustomers;
        
        if (customerIndex !== -1) {
            // Update existing customer
            updatedCustomers = customers.map((c, index) => 
                index === customerIndex 
                    ? { ...c, totalOrders: c.totalOrders + 1, totalSpent: c.totalSpent + calculateTotal(), loyaltyPoints: c.loyaltyPoints + Math.floor(calculateTotal() / 100), lastVisit: new Date().toISOString().split('T')[0] }
                    : c
            );
        } else {
            // Create new customer
            const newCustomer = {
                id: Date.now(),
                userId: userId,
                name: newOrder.customerName,
                phone: newOrder.customerPhone,
                email: '',
                address: '',
                loyaltyPoints: Math.floor(calculateTotal() / 100),
                totalOrders: 1,
                totalSpent: calculateTotal(),
                joinDate: new Date().toISOString().split('T')[0],
                lastVisit: new Date().toISOString().split('T')[0]
            };
            updatedCustomers = [...customers, newCustomer];
        }
        
        setCustomers(updatedCustomers);
        localStorage.setItem('restaurantCustomers', JSON.stringify(updatedCustomers));

        setNewOrder({ customerName: '', customerPhone: '', tableNumber: '', orderType: 'dine-in' });
        setSelectedItems([]);
        setCustomerSearch('');
        setShowNewOrderForm(false);
        alert('Order created successfully!');
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('restaurantOrders', JSON.stringify(updatedOrders));
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'preparing': return '#ffc107';
            case 'ready': return '#28a745';
            case 'served': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'preparing': return '🍳 Preparing';
            case 'ready': return '✅ Ready';
            case 'served': return '🍽️ Served';
            default: return '📋 Pending';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredOrders = orders
        .filter(order => {
            if (activeTab === 'all') return true;
            if (activeTab === 'dine-in') return order.orderType === 'dine-in';
            if (activeTab === 'takeaway') return order.orderType === 'takeaway';
            if (activeTab === 'online') return order.orderType === 'online';
            return false;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

    return (
        <div className={Styles.orderManagement}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>🍽️ Order Management</h1>
                    <button 
                        className={Styles.newOrderBtn}
                        onClick={() => setShowNewOrderForm(!showNewOrderForm)}
                    >
                        {showNewOrderForm ? '❌ Cancel' : '➕ New Order'}
                    </button>
                </div>

                <div className={Styles.tabs}>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'all' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        📋 All Orders
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'dine-in' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('dine-in')}
                    >
                        🍽️ Dine-in Orders
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'takeaway' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('takeaway')}
                    >
                        🥡 Takeaway Orders
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'online' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('online')}
                    >
                        📱 Online Orders
                    </button>
                </div>

                <div className={Styles.stats}>
                    <div className={Styles.statCard}>
                        <span className={Styles.statNumber}>{orders.length}</span>
                        <span className={Styles.statLabel}>Total Orders</span>
                    </div>
                    <div className={Styles.statCard}>
                        <span className={Styles.statNumber}>
                            {orders.filter(o => o.status === 'preparing').length}
                        </span>
                        <span className={Styles.statLabel}>Preparing</span>
                    </div>
                    <div className={Styles.statCard}>
                        <span className={Styles.statNumber}>
                            {orders.filter(o => o.status === 'ready').length}
                        </span>
                        <span className={Styles.statLabel}>Ready</span>
                    </div>
                </div>

                {showNewOrderForm && (
                    <div className={Styles.newOrderSection}>
                        <h2>Create New Order</h2>
                        <div className={Styles.orderForm}>
                            <div className={Styles.formLeft}>
                                <h3>Customer Details</h3>
                                <input
                                    type="text"
                                    placeholder="🔍 Search Customer by Name or Phone"
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                    className={Styles.input}
                                />
                                {customerSearch && (
                                    <div className={Styles.customerDropdown}>
                                        {customers
                                            .filter(c => 
                                                c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                                                c.phone.includes(customerSearch)
                                            )
                                            .slice(0, 5)
                                            .map(c => (
                                                <div 
                                                    key={c.id} 
                                                    className={Styles.customerOption}
                                                    onClick={() => {
                                                        setNewOrder({
                                                            ...newOrder,
                                                            customerName: c.name,
                                                            customerPhone: c.phone
                                                        });
                                                        setCustomerSearch('');
                                                    }}
                                                >
                                                    <strong>{c.name}</strong> - {c.phone}
                                                </div>
                                            ))
                                        }
                                        {customers.filter(c => 
                                            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                                            c.phone.includes(customerSearch)
                                        ).length === 0 && (
                                            <div className={Styles.noResults}>No customers found</div>
                                        )}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Customer Name *"
                                    value={newOrder.customerName}
                                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                                    className={Styles.input}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={newOrder.customerPhone}
                                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                                    className={Styles.input}
                                />
                                <select
                                    value={newOrder.orderType}
                                    onChange={(e) => setNewOrder({ ...newOrder, orderType: e.target.value })}
                                    className={Styles.input}
                                >
                                    <option value="dine-in">Dine-in</option>
                                    <option value="takeaway">Takeaway</option>
                                    <option value="online">Online</option>
                                </select>
                                {newOrder.orderType === 'dine-in' && (
                                    <select
                                        value={newOrder.tableNumber}
                                        onChange={(e) => setNewOrder({ ...newOrder, tableNumber: e.target.value })}
                                        className={Styles.input}
                                    >
                                        <option value="">Select Table</option>
                                        {tables.filter(t => t.status === 'available').map(t => (
                                            <option key={t.number} value={t.number}>{t.number} (Cap: {t.capacity})</option>
                                        ))}
                                        {tables.filter(t => t.status === 'reserved').map(t => (
                                            <option key={t.number} value={t.number}>{t.number} (Cap: {t.capacity}) - Booked</option>
                                        ))}
                                    </select>
                                )}

                                <h3>Menu Items</h3>
                                <div className={Styles.categoryFilter}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            className={`${Styles.categoryBtn} ${selectedCategory === cat ? Styles.activeCategory : ''}`}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat === 'all' ? '🍽️ All' : cat}
                                        </button>
                                    ))}
                                </div>
                                <div className={Styles.menuGrid}>
                                    {filteredMenuItems.map(item => (
                                        <div key={item.id} className={Styles.menuItem} onClick={() => addItemToOrder(item)}>
                                            <span>{item.name}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={Styles.formRight}>
                                <h3>Order Summary</h3>
                                {selectedItems.length === 0 ? (
                                    <p className={Styles.emptyCart}>No items added</p>
                                ) : (
                                    <>
                                        {selectedItems.map(item => (
                                            <div key={item.id} className={Styles.cartItem}>
                                                <span>{item.name}</span>
                                                <div className={Styles.qtyControl}>
                                                    <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                                <span>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div className={Styles.totalSection}>
                                            <h3>Total: ₹{calculateTotal()}</h3>
                                            <button className={Styles.createBtn} onClick={createOrder}>
                                                🍽️ Create Order
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className={Styles.ordersGrid}>
                    {filteredOrders.map(order => (
                        <div key={order.id} className={Styles.orderCard}>
                            <div className={Styles.orderHeader}>
                                <div>
                                    <h3>Order #{order.id}</h3>
                                    <p>{order.customerName} - {order.customerPhone}</p>
                                    {order.tableNumber && <p>Table: {order.tableNumber}</p>}
                                </div>
                                <span 
                                    className={Styles.statusBadge}
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                            <div className={Styles.orderItems}>
                                {order.items.map((item, index) => (
                                    <div key={index} className={Styles.item}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={Styles.orderFooter}>
                                <strong>Total: {formatCurrency(order.totalAmount)}</strong>
                                <div className={Styles.actions}>
                                    {order.status === 'preparing' && (
                                        <button onClick={() => updateOrderStatus(order.id, 'ready')}>
                                            Mark Ready
                                        </button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button onClick={() => updateOrderStatus(order.id, 'served')}>
                                            Mark Served
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantOrderManagement;
