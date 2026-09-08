import { useState, useEffect } from 'react'
import Styles from '../styles/RestaurantBilling.module.css'

const RestaurantBilling = () => {
    const [cart, setCart] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        tableNumber: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [previousOrders, setPreviousOrders] = useState([]);
    const [restaurantName, setRestaurantName] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showOrderSelection, setShowOrderSelection] = useState(false);
    const [gstRate, setGstRate] = useState(5); // Default GST rate, can be updated from settings

    useEffect(() => {
        loadCustomers();
        loadPreviousOrders();
        loadRestaurantName();
        loadGstRate();
    }, []);

    const loadGstRate = () => {
        // Try to get GST rate from user settings first
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            if (parsedData.settings && parsedData.settings.gstRate) {
                setGstRate(parsedData.settings.gstRate);
                return;
            }
        }
        
        // Try to get from business settings
        const businessSettings = localStorage.getItem('businessSettings');
        if (businessSettings) {
            const settings = JSON.parse(businessSettings);
            if (settings.gstRate) {
                setGstRate(settings.gstRate);
                return;
            }
        }
        
        // Default to 5% if no settings found
        setGstRate(5);
    };

    const loadCustomers = () => {
        // Get current user data
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id || parsedUserData.userId;
        setCurrentUserId(userId);

        const savedCustomers = localStorage.getItem('restaurantCustomers');
        if (savedCustomers) {
            const allCustomers = JSON.parse(savedCustomers);
            const customers = allCustomers.filter(customer => customer.userId === userId);
            setCustomers(customers);
        }
    };

    const loadPreviousOrders = () => {
        // Get current user data
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id || parsedUserData.userId;

        const savedOrders = localStorage.getItem('restaurantOrders');
        if (savedOrders) {
            const allOrders = JSON.parse(savedOrders);
            const orders = allOrders.filter(order => order.userId === userId);
            // Only show served orders that haven't been billed yet
            setPreviousOrders(orders.filter(o => o.status === 'served'));
        }
    };

    const loadRestaurantName = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            
            // Set business name with proper fallbacks
            let businessName = parsedData.businessName;
            if (!businessName) {
                businessName = parsedData.restaurantName || 'My Restaurant';
            }
            setRestaurantName(businessName);
        }
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity === 0) {
            setCart(cart.filter(item => item.id !== itemId));
        } else {
            setCart(cart.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateGST = () => {
        return calculateSubtotal() * (gstRate / 100);
    };

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        
        // Get coupon codes from settings
        const getCouponSettings = () => {
            const businessSettings = localStorage.getItem('businessSettings');
            if (businessSettings) {
                const settings = JSON.parse(businessSettings);
                if (settings.coupons) {
                    return settings.coupons;
                }
            }
            
            // Fallback default coupons
            return {
                'SAVE10': 0.1,  // 10% discount
                'SAVE20': 0.2   // 20% discount
            };
        };

        const coupons = getCouponSettings();
        
        if (couponCode && coupons[couponCode]) {
            return subtotal * coupons[couponCode];
        } else if (discount > 0) {
            return subtotal * (discount / 100);
        }
        return 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateGST() - calculateDiscount();
    };

    const selectCustomer = (customer) => {
        setCustomerInfo({
            name: customer.name,
            phone: customer.phone,
            tableNumber: ''
        });
        setCustomerSearch('');
        loadCustomerOrders(customer.phone);
    };

    const selectPreviousOrder = (order) => {
        setCustomerInfo({
            name: order.customerName,
            phone: order.customerPhone,
            tableNumber: order.tableNumber || ''
        });
        setCart(order.items);
        setCustomerSearch('');
    };

    const loadCustomerOrders = (phone) => {
        // Only load served orders that haven't been billed
        const orders = previousOrders.filter(o => o.customerPhone === phone && o.status === 'served');
        
        if (orders.length === 0) {
            alert('No pending orders found for this customer!');
            return;
        }
        
        setSelectedOrders(orders);
        setShowOrderSelection(true);
        
        // Auto-load all items from customer's orders
        const allItems = [];
        orders.forEach(order => {
            order.items.forEach(item => {
                const existing = allItems.find(i => i.name === item.name);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    allItems.push({ ...item, id: Date.now() + Math.random() });
                }
            });
        });
        setCart(allItems);
    };

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch)
    );

    const filteredOrders = previousOrders.filter(order => 
        order.customerName.toLowerCase().includes(customerSearch.toLowerCase()) ||
        order.customerPhone.includes(customerSearch)
    );

    const generateBill = () => {
        const bill = {
            customerInfo,
            items: cart,
            subtotal: calculateSubtotal(),
            gst: calculateGST(),
            discount: calculateDiscount(),
            total: calculateTotal(),
            paymentMethod,
            timestamp: new Date().toISOString(),
            billNumber: `BILL-${Date.now()}`
        };
        
        // Save bill to localStorage
        const existingBills = JSON.parse(localStorage.getItem('restaurantBills') || '[]');
        existingBills.push(bill);
        localStorage.setItem('restaurantBills', JSON.stringify(existingBills));
        
        // Mark selected orders as billed
        if (selectedOrders.length > 0) {
            const allOrders = JSON.parse(localStorage.getItem('restaurantOrders') || '[]');
            const updatedOrders = allOrders.map(order => {
                if (selectedOrders.find(so => so.id === order.id)) {
                    return { ...order, status: 'billed' };
                }
                return order;
            });
            localStorage.setItem('restaurantOrders', JSON.stringify(updatedOrders));
        }
        
        // Print bill (in real app, this would open print dialog)
        printBill(bill);
        
        // Clear cart
        setCart([]);
        setCustomerInfo({ name: '', phone: '', tableNumber: '' });
        setDiscount(0);
        setCouponCode('');
        setSelectedOrders([]);
        setShowOrderSelection(false);
        
        // Reload orders to reflect changes
        loadPreviousOrders();
        
        alert('Bill generated successfully!');
    };

    const printBill = (bill) => {
        const printWindow = window.open('', '_blank');
        const billHTML = `
            <html>
                <head>
                    <title>Restaurant Bill</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .bill-info { margin-bottom: 20px; }
                        .items { margin-bottom: 20px; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                        .total { border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
                        .footer { margin-top: 20px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🍽️ ${restaurantName || 'Restaurant'}</h1>
                        <h2>Restaurant Bill</h2>
                        <p>Bill Number: ${bill.billNumber}</p>
                        <p>Date: ${new Date(bill.timestamp).toLocaleString()}</p>
                    </div>
                    <div class="bill-info">
                        <p><strong>Customer:</strong> ${bill.customerInfo.name}</p>
                        <p><strong>Phone:</strong> ${bill.customerInfo.phone}</p>
                        <p><strong>Table:</strong> ${bill.customerInfo.tableNumber}</p>
                    </div>
                    <div class="items">
                        <h3>Items:</h3>
                        ${bill.items.map(item => `
                            <div class="item">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="total">
                        <div class="item"><strong>Subtotal:</strong><span>₹${bill.subtotal.toFixed(2)}</span></div>
                        <div class="item"><strong>GST (${gstRate}%):</strong><span>₹${bill.gst.toFixed(2)}</span></div>
                        <div class="item"><strong>Discount:</strong><span>-₹${bill.discount.toFixed(2)}</span></div>
                        <div class="item"><strong>Total:</strong><span>₹${bill.total.toFixed(2)}</span></div>
                        <div class="item"><strong>Payment:</strong><span>${bill.paymentMethod}</span></div>
                    </div>
                    <div class="footer">
                        <p>Thank you for visiting ${restaurantName || 'our restaurant'}! 🙏</p>
                        <p>🍽️ ${restaurantName || 'Restaurant'} - Quality Food & Service</p>
                    </div>
                </body>
            </html>
        `;
        printWindow.document.write(billHTML);
        printWindow.document.close();
        printWindow.print();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className={Styles.billing}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <div>
                        <h1>{restaurantName || 'Restaurant Billing'}</h1>
                        <p className={Styles.subtitle}>💳 Billing & POS System</p>
                        {restaurantName && (
                            <p className={Styles.businessInfo}>🍽️ {restaurantName}</p>
                        )}
                    </div>
                    <div className={Styles.quickStats}>
                        <div className={Styles.stat}>
                            <span>{cart.length}</span>
                            <span>Items</span>
                        </div>
                        <div className={Styles.stat}>
                            <span>{formatCurrency(calculateTotal())}</span>
                            <span>Total</span>
                        </div>
                    </div>
                </div>

                <div className={Styles.billingLayout}>
                    {/* Billing Section */}
                    <div className={Styles.billingSection}>
                        {/* Customer Info */}
                        <div className={Styles.customerInfo}>
                            <h3>👤 Customer Information</h3>
                            
                            {/* Customer Search */}
                            <div className={Styles.searchSection}>
                                <input
                                    type="text"
                                    placeholder="🔍 Search Customer or Previous Order..."
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                    className={Styles.searchInput}
                                />
                                {customerSearch && (
                                    <div className={Styles.searchResults}>
                                        {/* Filtered Customers */}
                                        {filteredCustomers.slice(0, 3).map(customer => (
                                            <div 
                                                key={customer.id} 
                                                className={Styles.searchResult}
                                                onClick={() => selectCustomer(customer)}
                                            >
                                                <div>
                                                    <strong>{customer.name}</strong>
                                                    <span>{customer.phone}</span>
                                                </div>
                                                <small>Customer</small>
                                            </div>
                                        ))}
                                        
                                                        {/* Filtered Previous Orders */}
                                        {filteredOrders.slice(0, 3).map(order => (
                                            <div 
                                                key={order.id} 
                                                className={Styles.searchResult}
                                                onClick={() => {
                                                    setCustomerInfo({
                                                        name: order.customerName,
                                                        phone: order.customerPhone,
                                                        tableNumber: order.tableNumber || ''
                                                    });
                                                    setCustomerSearch('');
                                                    loadCustomerOrders(order.customerPhone);
                                                }}
                                            >
                                                <div>
                                                    <strong>{order.customerName}</strong>
                                                    <span>{order.customerPhone}</span>
                                                    <small>Order #{order.id} - {formatCurrency(order.totalAmount)}</small>
                                                </div>
                                                <small>Previous Order</small>
                                            </div>
                                        ))}
                                        
                                        {(filteredCustomers.length === 0 && filteredOrders.length === 0) && (
                                            <div className={Styles.noResults}>
                                                No customers or orders found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div className={Styles.infoForm}>
                                <input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                    className={Styles.input}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                    className={Styles.input}
                                />
                                <input
                                    type="text"
                                    placeholder="Table Number"
                                    value={customerInfo.tableNumber}
                                    onChange={(e) => setCustomerInfo({...customerInfo, tableNumber: e.target.value})}
                                    className={Styles.input}
                                />
                            </div>
                        </div>

                        {/* Selected Orders Summary */}
                        {showOrderSelection && selectedOrders.length > 0 && (
                            <div className={Styles.ordersInfo}>
                                <h3>📋 Customer Orders ({selectedOrders.length})</h3>
                                <div className={Styles.ordersList}>
                                    {selectedOrders.map(order => (
                                        <div key={order.id} className={Styles.orderItem}>
                                            <span>Order #{order.id}</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span>{formatCurrency(order.totalAmount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cart */}
                        <div className={Styles.cart}>
                            <h3>🛒 Cart</h3>
                            {cart.length === 0 ? (
                                <p className={Styles.emptyCart}>Cart is empty</p>
                            ) : (
                                <div className={Styles.cartItems}>
                                    {cart.map(item => (
                                        <div key={item.id} className={Styles.cartItem}>
                                            <div className={Styles.itemDetails}>
                                                <h4>{item.name}</h4>
                                                <span>{formatCurrency(item.price)}</span>
                                            </div>
                                            <div className={Styles.quantityControls}>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className={Styles.quantityBtn}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className={Styles.quantityBtn}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className={Styles.itemTotal}>
                                                {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment & Discounts */}
                        <div className={Styles.paymentSection}>
                            <h3>💳 Payment & Discounts</h3>
                            
                            <div className={Styles.paymentMethods}>
                                <label>
                                    <input
                                        type="radio"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    💵 Cash
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    📱 UPI
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    💳 Card
                                </label>
                            </div>

                            <div className={Styles.discountSection}>
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className={Styles.input}
                                />
                                <input
                                    type="number"
                                    placeholder="Discount %"
                                    value={discount}
                                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, e.target.value)))}
                                    className={Styles.input}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        {/* Bill Summary */}
                        <div className={Styles.billSummary}>
                            <h3>🧾 Bill Summary</h3>
                            <div className={Styles.summaryRow}>
                                <span>Subtotal:</span>
                                <span>{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            <div className={Styles.summaryRow}>
                                <span>GST ({gstRate}%):</span>
                                <span>{formatCurrency(calculateGST())}</span>
                            </div>
                            <div className={Styles.summaryRow}>
                                <span>Discount:</span>
                                <span>-{formatCurrency(calculateDiscount())}</span>
                            </div>
                            <div className={`${Styles.summaryRow} ${Styles.totalRow}`}>
                                <span><strong>Total:</strong></span>
                                <span><strong>{formatCurrency(calculateTotal())}</strong></span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={Styles.actions}>
                            <button 
                                className={Styles.printBtn}
                                onClick={() => window.print()}
                            >
                                🖨️ Print Bill
                            </button>
                            <button 
                                className={Styles.generateBtn}
                                onClick={generateBill}
                                disabled={cart.length === 0}
                            >
                                💳 Generate Bill
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantBilling;
