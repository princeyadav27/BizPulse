import { useState, useEffect } from 'react'
import Styles from '../styles/CustomerManagement.module.css'
import { PiTrash } from 'react-icons/pi'

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [activeTab, setActiveTab] = useState('list');
    const [businessName, setBusinessName] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        loyaltyPoints: 0,
        totalOrders: 0,
        totalSpent: 0
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadBusinessName();
        loadCustomers();
    }, []);

    const loadBusinessName = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            
            // Set business name with proper fallbacks
            let businessName = parsedData.businessName;
            if (!businessName) {
                businessName = parsedData.restaurantName || 'My Restaurant';
            }
            setBusinessName(businessName);
            setCurrentUserId(parsedData.id || parsedData.userId);
        }
    };

    const loadCustomers = () => {
        // Get current user data
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id || parsedUserData.userId;

        const saved = localStorage.getItem('restaurantCustomers');
        if (saved) {
            const allCustomers = JSON.parse(saved);
            const customers = allCustomers.filter(customer => customer.userId === userId);
            setCustomers(customers);
        }
    };

    const saveCustomers = (data) => {
        setCustomers(data);
        localStorage.setItem('restaurantCustomers', JSON.stringify(data));
    };

    const addCustomer = () => {
        if (newCustomer.name && newCustomer.phone) {
            const customer = {
                id: Date.now(),
                userId: currentUserId,
                ...newCustomer,
                joinDate: new Date().toISOString().split('T')[0],
                lastVisit: new Date().toISOString().split('T')[0]
            };
            saveCustomers([...customers, customer]);
            setNewCustomer({
                name: '',
                phone: '',
                email: '',
                address: '',
                loyaltyPoints: 0,
                totalOrders: 0,
                totalSpent: 0
            });
            setActiveTab('list');
        }
    };

    const deleteCustomer = (id) => {
        if (window.confirm('Delete this customer?')) {
            saveCustomers(customers.filter(c => c.id !== id));
        }
    };

    const addLoyaltyPoints = (id, points) => {
        const updated = customers.map(c => 
            c.id === id ? { ...c, loyaltyPoints: c.loyaltyPoints + parseInt(points) } : c
        );
        saveCustomers(updated);
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

    return (
        <div className={Styles.customerManagement}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>Customer Management</h1>
                    <div className={Styles.stats}>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{customers.length}</span>
                            <span className={Styles.statLabel}>Total Customers</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>
                                ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('en-IN')}
                            </span>
                            <span className={Styles.statLabel}>Total Revenue</span>
                        </div>
                    </div>
                </div>

                <div className={Styles.tabs}>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'list' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Customer List
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'add' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        Add Customer
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'top' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('top')}
                    >
                        Top Customers
                    </button>
                </div>

                {activeTab === 'add' && (
                    <div className={Styles.formSection}>
                        <h2>Add New Customer</h2>
                        <div className={Styles.form}>
                            <input
                                type="text"
                                placeholder="Customer Name *"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                className={Styles.input}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number *"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                className={Styles.input}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                className={Styles.input}
                            />
                            <textarea
                                placeholder="Address"
                                value={newCustomer.address}
                                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                                className={Styles.textarea}
                                rows="3"
                            />
                            <button className={Styles.addBtn} onClick={addCustomer}>
                                Add Customer
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'list' && (
                    <div className={Styles.listSection}>
                        <div className={Styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={Styles.searchInput}
                            />
                        </div>
                        <div className={Styles.customerGrid}>
                            {filteredCustomers.map(customer => (
                                <div key={customer.id} className={Styles.customerCard}>
                                    <div className={Styles.customerHeader}>
                                        <div className={Styles.customerInfo}>
                                            <div className={Styles.avatar}>
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3>{customer.name}</h3>
                                                <p>{customer.phone}</p>
                                            </div>
                                        </div>
                                        <button 
                                            className={Styles.deleteBtn}
                                            onClick={() => deleteCustomer(customer.id)}
                                        ><PiTrash aria-hidden="true" /></button>
                                    </div>
                                    <div className={Styles.customerDetails}>
                                        {customer.email && <p>{customer.email}</p>}
                                        {customer.address && <p>{customer.address}</p>}
                                        <p>Loyalty Points: <strong>{customer.loyaltyPoints}</strong></p>
                                        <p>Total Orders: <strong>{customer.totalOrders}</strong></p>
                                        <p>Total Spent: <strong>₹{customer.totalSpent.toLocaleString('en-IN')}</strong></p>
                                        <p>Joined: {new Date(customer.joinDate).toLocaleDateString()}</p>
                                        <p>Last Visit: {new Date(customer.lastVisit).toLocaleDateString()}</p>
                                    </div>
                                    <div className={Styles.actions}>
                                        <button 
                                            className={Styles.pointsBtn}
                                            onClick={() => {
                                                const points = prompt('Add loyalty points:');
                                                if (points) addLoyaltyPoints(customer.id, points);
                                            }}
                                        >
                                            Add Points
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredCustomers.length === 0 && (
                            <div className={Styles.emptyState}>
                                <p>No customers found</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'top' && (
                    <div className={Styles.topSection}>
                        <h2>Top 5 Customers by Revenue</h2>
                        <div className={Styles.topList}>
                            {topCustomers.map((customer, index) => (
                                <div key={customer.id} className={Styles.topCard}>
                                    <div className={Styles.rank}>#{index + 1}</div>
                                    <div className={Styles.topInfo}>
                                        <h3>{customer.name}</h3>
                                        <p>{customer.phone}</p>
                                    </div>
                                    <div className={Styles.topStats}>
                                        <div>
                                            <span className={Styles.topLabel}>Total Spent</span>
                                            <span className={Styles.topValue}>₹{customer.totalSpent.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div>
                                            <span className={Styles.topLabel}>Orders</span>
                                            <span className={Styles.topValue}>{customer.totalOrders}</span>
                                        </div>
                                        <div>
                                            <span className={Styles.topLabel}>Points</span>
                                            <span className={Styles.topValue}>{customer.loyaltyPoints}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {topCustomers.length === 0 && (
                            <div className={Styles.emptyState}>
                                <p>No customers yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerManagement;
