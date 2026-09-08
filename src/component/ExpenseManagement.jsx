import { useState, useEffect } from 'react'
import Styles from '../styles/ExpenseManagement.module.css'

const ExpenseManagement = () => {
    const [expenses, setExpenses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        category: 'rent',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            setExpenses(JSON.parse(savedExpenses));
        }
    }, []);

    const handleAddExpense = (e) => {
        e.preventDefault();
        const expense = {
            id: Date.now(),
            ...newExpense,
            amount: parseFloat(newExpense.amount)
        };
        const updatedExpenses = [...expenses, expense];
        setExpenses(updatedExpenses);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        setNewExpense({ category: 'rent', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
        setShowAddForm(false);
    };

    const handleDeleteExpense = (id) => {
        if (confirm('Delete this expense?')) {
            const updatedExpenses = expenses.filter(exp => exp.id !== id);
            setExpenses(updatedExpenses);
            localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        }
    };

    const getTotalExpenses = () => {
        return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    };

    const getMonthlyExpenses = () => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        return expenses.filter(exp => exp.date.startsWith(currentMonth)).reduce((sum, exp) => sum + exp.amount, 0);
    };

    const getTodayExpenses = () => {
        const today = new Date().toISOString().split('T')[0];
        return expenses.filter(exp => exp.date === today).reduce((sum, exp) => sum + exp.amount, 0);
    };

    const getCategoryTotal = (category) => {
        return expenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0);
    };

    return (
        <div className={Styles.expenseManagement}>
            <div className={Styles.header}>
                <h1>Expense Management</h1>
                <button onClick={() => setShowAddForm(!showAddForm)} className={Styles.addBtn}>
                    {showAddForm ? 'Cancel' : '+ Add Expense'}
                </button>
            </div>

            <div className={Styles.summary}>
                <div className={Styles.card}>
                    <h3>Today's Expenses</h3>
                    <p>₹{getTodayExpenses().toFixed(2)}</p>
                </div>
                <div className={Styles.card}>
                    <h3>This Month</h3>
                    <p>₹{getMonthlyExpenses().toFixed(2)}</p>
                </div>
                <div className={Styles.card}>
                    <h3>Total Expenses</h3>
                    <p>₹{getTotalExpenses().toFixed(2)}</p>
                </div>
                <div className={Styles.card}>
                    <h3>Supplies</h3>
                    <p>₹{getCategoryTotal('supplies').toFixed(2)}</p>
                </div>
            </div>

            {showAddForm && (
                <div className={Styles.addForm}>
                    <h2>Add New Expense</h2>
                    <form onSubmit={handleAddExpense}>
                        <select
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                            required
                        >
                            <option value="rent">Rent</option>
                            <option value="utilities">Utilities (Electricity, Water)</option>
                            <option value="salaries">Salaries</option>
                            <option value="supplies">Supplies (Dal, Chawal, Vegetables, etc.)</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="marketing">Marketing</option>
                            <option value="other">Other</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Amount"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                            required
                        />
                        <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                            required
                        />
                        <button type="submit" className={Styles.submitBtn}>Add Expense</button>
                    </form>
                </div>
            )}

            <div className={Styles.expenseList}>
                <h2>Expense History ({expenses.length} entries)</h2>
                {expenses.length === 0 ? (
                    <p style={{textAlign: 'center', padding: '20px', color: '#666'}}>No expenses added yet. Click "+ Add Expense" to start tracking.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => (
                                <tr key={expense.id}>
                                    <td>{expense.date}</td>
                                    <td>{expense.category}</td>
                                    <td>{expense.description}</td>
                                    <td>₹{expense.amount.toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handleDeleteExpense(expense.id)} className={Styles.deleteBtn}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ExpenseManagement;
