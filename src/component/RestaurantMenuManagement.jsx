import { useState, useEffect } from 'react'
import Styles from '../styles/RestaurantMenuManagement.module.css'
import { PiTrash } from 'react-icons/pi'

const RestaurantMenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('items');
    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        available: true
    });
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        loadMenuItems();
        loadCategories();
    }, []);

    const loadMenuItems = () => {
        const savedMenu = localStorage.getItem('restaurantMenu');
        if (savedMenu) {
            setMenuItems(JSON.parse(savedMenu));
        } else {
            // Sample menu items
            const sampleMenu = [
                { id: 1, name: 'Butter Chicken', category: 'Main Course', price: 250, description: 'Tender chicken in rich butter gravy', available: true },
                { id: 2, name: 'Paneer Tikka', category: 'Starter', price: 200, description: 'Grilled cottage cheese with spices', available: true },
                { id: 3, name: 'Biryani', category: 'Main Course', price: 150, description: 'Fragrant rice with aromatic spices', available: true },
                { id: 4, name: 'Naan', category: 'Bread', price: 20, description: 'Traditional Indian bread', available: true },
                { id: 5, name: 'Cold Coffee', category: 'Beverages', price: 80, description: 'Chilled coffee with ice cream', available: true },
                { id: 6, name: 'Ice Cream', category: 'Desserts', price: 60, description: 'Vanilla ice cream scoop', available: true }
            ];
            setMenuItems(sampleMenu);
        }
    };

    const loadCategories = () => {
        const savedCategories = localStorage.getItem('restaurantCategories');
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        } else {
            const defaultCategories = ['Starter', 'Main Course', 'Bread', 'Beverages', 'Desserts'];
            setCategories(defaultCategories);
            localStorage.setItem('restaurantCategories', JSON.stringify(defaultCategories));
        }
    };

    const saveMenuItems = (items) => {
        setMenuItems(items);
        localStorage.setItem('restaurantMenu', JSON.stringify(items));
    };

    const saveCategories = (cats) => {
        setCategories(cats);
        localStorage.setItem('restaurantCategories', JSON.stringify(cats));
    };

    const addMenuItem = () => {
        if (newItem.name && newItem.category && newItem.price) {
            const item = {
                id: Date.now(),
                name: newItem.name,
                category: newItem.category,
                price: parseFloat(newItem.price),
                description: newItem.description,
                available: newItem.available
            };
            saveMenuItems([...menuItems, item]);
            setNewItem({ name: '', category: '', price: '', description: '', available: true });
        }
    };

    const updateMenuItem = () => {
        if (editingItem) {
            const updatedItems = menuItems.map(item => 
                item.id === editingItem.id 
                    ? { ...item, ...editingItem }
                    : item
            );
            saveMenuItems(updatedItems);
            setEditingItem(null);
        }
    };

    const deleteMenuItem = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            saveMenuItems(menuItems.filter(item => item.id !== id));
        }
    };

    const toggleAvailability = (id) => {
        const updatedItems = menuItems.map(item => 
            item.id === id ? { ...item, available: !item.available } : item
        );
        saveMenuItems(updatedItems);
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            saveCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const deleteCategory = (category) => {
        if (window.confirm(`Are you sure you want to delete "${category}" category?`)) {
            const updatedCategories = categories.filter(cat => cat !== category);
            saveCategories(updatedCategories);
            
            // Update items in deleted category to 'Uncategorized'
            const updatedItems = menuItems.map(item => 
                item.category === category ? { ...item, category: 'Uncategorized' } : item
            );
            saveMenuItems(updatedItems);
        }
    };

    const startEdit = (item) => {
        setEditingItem({ ...item });
    };

    const cancelEdit = () => {
        setEditingItem(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredItems = activeTab === 'items' ? menuItems : menuItems.filter(item => item.category === activeTab);

    return (
        <div className={Styles.menuManagement}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>Menu Management</h1>
                    <div className={Styles.stats}>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{menuItems.length}</span>
                            <span className={Styles.statLabel}>Total Items</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{menuItems.filter(item => item.available).length}</span>
                            <span className={Styles.statLabel}>Available</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{categories.length}</span>
                            <span className={Styles.statLabel}>Categories</span>
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className={Styles.tabs}>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'items' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('items')}
                    >
                        All Items
                    </button>
                    {categories.map(category => (
                        <button 
                            key={category}
                            className={`${Styles.tab} ${activeTab === category ? Styles.active : ''}`}
                            onClick={() => setActiveTab(category)}
                        >
                            {category}
                        </button>
                    ))}
                    <button 
                        className={`${Styles.tab} ${activeTab === 'categories' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Manage Categories
                    </button>
                </div>

                {/* Add/Edit Item Form */}
                {(activeTab === 'items' || categories.includes(activeTab)) && (
                    <div className={Styles.formSection}>
                        <h2>{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h2>
                        <div className={Styles.itemForm}>
                            <div className={Styles.formRow}>
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    value={editingItem ? editingItem.name : newItem.name}
                                    onChange={(e) => editingItem 
                                        ? setEditingItem({...editingItem, name: e.target.value})
                                        : setNewItem({...newItem, name: e.target.value})
                                    }
                                    className={Styles.input}
                                />
                                <select
                                    value={editingItem ? editingItem.category : newItem.category}
                                    onChange={(e) => editingItem 
                                        ? setEditingItem({...editingItem, category: e.target.value})
                                        : setNewItem({...newItem, category: e.target.value})
                                    }
                                    className={Styles.select}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={editingItem ? editingItem.price : newItem.price}
                                    onChange={(e) => editingItem 
                                        ? setEditingItem({...editingItem, price: e.target.value})
                                        : setNewItem({...newItem, price: e.target.value})
                                    }
                                    className={Styles.input}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className={Styles.formRow}>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={editingItem ? editingItem.description : newItem.description}
                                    onChange={(e) => editingItem 
                                        ? setEditingItem({...editingItem, description: e.target.value})
                                        : setNewItem({...newItem, description: e.target.value})
                                    }
                                    className={Styles.input}
                                    style={{ flex: 1 }}
                                />
                                <label className={Styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={editingItem ? editingItem.available : newItem.available}
                                        onChange={(e) => editingItem 
                                            ? setEditingItem({...editingItem, available: e.target.checked})
                                            : setNewItem({...newItem, available: e.target.checked})
                                        }
                                    />
                                    Available
                                </label>
                            </div>
                            <div className={Styles.formActions}>
                                {editingItem ? (
                                    <>
                                        <button className={Styles.saveBtn} onClick={updateMenuItem}>
                                            Update Item
                                        </button>
                                        <button className={Styles.cancelBtn} onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className={Styles.addBtn} onClick={addMenuItem}>
                                        Add Item
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories Management */}
                {activeTab === 'categories' && (
                    <div className={Styles.formSection}>
                        <h2>Category Management</h2>
                        <div className={Styles.categoryForm}>
                            <div className={Styles.formRow}>
                                <input
                                    type="text"
                                    placeholder="New Category Name"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className={Styles.input}
                                />
                                <button className={Styles.addBtn} onClick={addCategory}>
                                    Add Category
                                </button>
                            </div>
                        </div>
                        <div className={Styles.categoriesList}>
                            {categories.map(category => (
                                <div key={category} className={Styles.categoryCard}>
                                    <span>{category}</span>
                                    <button 
                                        className={Styles.deleteBtn}
                                        onClick={() => deleteCategory(category)}
                                    ><PiTrash aria-hidden="true" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Menu Items Grid */}
                {(activeTab === 'items' || categories.includes(activeTab)) && (
                    <div className={Styles.itemsGrid}>
                        {filteredItems.map(item => (
                            <div key={item.id} className={`${Styles.itemCard} ${!item.available ? Styles.unavailable : ''}`}>
                                <div className={Styles.itemHeader}>
                                    <h3>{item.name}</h3>
                                    <div className={Styles.itemActions}>
                                        <button 
                                            className={Styles.editBtn}
                                            onClick={() => startEdit(item)}
                                        >
                                            
                                        </button>
                                        <button 
                                            className={Styles.deleteBtn}
                                            onClick={() => deleteMenuItem(item.id)}
                                        ><PiTrash aria-hidden="true" /></button>
                                    </div>
                                </div>
                                <div className={Styles.itemDetails}>
                                    <span className={Styles.category}>{item.category}</span>
                                    <span className={Styles.price}>{formatCurrency(item.price)}</span>
                                </div>
                                <p className={Styles.description}>{item.description}</p>
                                <div className={Styles.itemFooter}>
                                    <span className={`${Styles.availability} ${item.available ? Styles.available : Styles.unavailable}`}>
                                        {item.available ? 'Available' : 'Out of Stock'}
                                    </span>
                                    <button 
                                        className={Styles.toggleBtn}
                                        onClick={() => toggleAvailability(item.id)}
                                    >
                                        {item.available ? 'Mark Unavailable' : 'Mark Available'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantMenuManagement;
