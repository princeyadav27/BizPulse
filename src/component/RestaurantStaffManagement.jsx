import { useState, useEffect } from 'react'
import Styles from '../styles/RestaurantStaffManagement.module.css'

const RestaurantStaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [activeTab, setActiveTab] = useState('staff');
    const [newStaff, setNewStaff] = useState({
        name: '',
        phone: '',
        email: '',
        role: 'waiter',
        salary: 0,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active'
    });
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [attendanceData, setAttendanceData] = useState({});
    const [bonusAmount, setBonusAmount] = useState({});

    useEffect(() => {
        loadStaff();
        loadAttendance();
        loadSalaries();
    }, []);

    const loadStaff = () => {
        const savedStaff = localStorage.getItem('restaurantStaff');
        if (savedStaff) {
            setStaff(JSON.parse(savedStaff));
        } else {
            // Sample staff data
            const sampleStaff = [
                { id: 1, name: 'Robert Chen', phone: '9876543210', email: 'robert@restaurant.com', role: 'chef', salary: 25000, joinDate: '2024-01-15', status: 'active' },
                { id: 2, name: 'Maria Garcia', phone: '9876543211', email: 'maria@restaurant.com', role: 'waiter', salary: 15000, joinDate: '2024-02-01', status: 'active' },
                { id: 3, name: 'James Wilson', phone: '9876543212', email: 'james@restaurant.com', role: 'manager', salary: 35000, joinDate: '2023-12-01', status: 'active' },
                { id: 4, name: 'Lisa Anderson', phone: '9876543213', email: 'lisa@restaurant.com', role: 'waiter', salary: 15000, joinDate: '2024-03-01', status: 'active' },
                { id: 5, name: 'David Kim', phone: '9876543214', email: 'david@restaurant.com', role: 'cleaner', salary: 12000, joinDate: '2024-01-20', status: 'active' }
            ];
            setStaff(sampleStaff);
        }
    };

    const loadAttendance = () => {
        const savedAttendance = localStorage.getItem('restaurantAttendance');
        if (savedAttendance) {
            const parsedAttendance = JSON.parse(savedAttendance);
            setAttendance(parsedAttendance);
            
            // Also save to attendanceData for summary calculation
            const today = new Date();
            const currentMonth = today.toISOString().slice(0, 7);
            setAttendanceData(parsedAttendance);
        } else {
            // Generate sample attendance for current month
            const today = new Date();
            const currentMonth = today.toISOString().slice(0, 7);
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            
            const sampleAttendance = [];
            for (let day = 1; day <= daysInMonth; day++) {
                const date = `${currentMonth}-${day.toString().padStart(2, '0')}`;
                staff.forEach(employee => {
                    if (day <= today.getDate()) {
                        sampleAttendance.push({
                            id: Date.now() + Math.random(),
                            employeeId: employee.id,
                            date: date,
                            status: Math.random() > 0.1 ? 'present' : 'absent',
                            checkIn: Math.random() > 0.1 ? '09:00' : null,
                            checkOut: Math.random() > 0.1 ? '18:00' : null
                        });
                    }
                });
            }
            setAttendance(sampleAttendance);
            setAttendanceData(sampleAttendance);
            localStorage.setItem('restaurantAttendance', JSON.stringify(sampleAttendance));
        }
    };

    const loadSalaries = () => {
        const savedSalaries = localStorage.getItem('restaurantSalaries');
        if (savedSalaries) {
            setSalaries(JSON.parse(savedSalaries));
        } else {
            // Sample salary records
            const sampleSalaries = [
                { id: 1, employeeId: 1, month: '2024-03', baseSalary: 25000, overtime: 2000, deductions: 1500, netSalary: 25500, paid: true, paidDate: '2024-03-31' },
                { id: 2, employeeId: 2, month: '2024-03', baseSalary: 15000, overtime: 500, deductions: 800, netSalary: 14700, paid: true, paidDate: '2024-03-31' },
                { id: 3, employeeId: 3, month: '2024-03', baseSalary: 35000, overtime: 0, deductions: 2000, netSalary: 33000, paid: false, paidDate: null }
            ];
            setSalaries(sampleSalaries);
        }
    };

    const saveStaff = (staffList) => {
        setStaff(staffList);
        localStorage.setItem('restaurantStaff', JSON.stringify(staffList));
    };

    const addStaff = () => {
        if (newStaff.name && newStaff.phone && newStaff.role) {
            const employee = {
                id: Date.now(),
                ...newStaff,
                salary: parseFloat(newStaff.salary)
            };
            saveStaff([...staff, employee]);
            setNewStaff({
                name: '',
                phone: '',
                email: '',
                role: 'waiter',
                salary: 0,
                joinDate: new Date().toISOString().split('T')[0],
                status: 'active'
            });
        }
    };

    const deleteStaff = (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            saveStaff(staff.filter(employee => employee.id !== id));
        }
    };

    const updateStaffStatus = (id, status) => {
        const updatedStaff = staff.map(employee => 
            employee.id === id ? { ...employee, status } : employee
        );
        saveStaff(updatedStaff);
    };

    const markAttendance = (employeeId, date, status) => {
        const existingRecord = attendanceData.find(record => 
            record.employeeId === employeeId && record.date === date
        );
        
        let updatedAttendance;
        if (existingRecord) {
            updatedAttendance = attendanceData.map(record => 
                record.employeeId === employeeId && record.date === date
                    ? { ...record, status, checkIn: status === 'present' ? '09:00' : null, checkOut: status === 'present' ? '18:00' : null }
                    : record
            );
        } else {
            const newRecord = {
                id: Date.now(),
                employeeId,
                date,
                status,
                checkIn: status === 'present' ? '09:00' : null,
                checkOut: status === 'present' ? '18:00' : null
            };
            updatedAttendance = [...attendanceData, newRecord];
        }
        
        setAttendanceData(updatedAttendance);
        setAttendance(updatedAttendance);
        localStorage.setItem('restaurantAttendance', JSON.stringify(updatedAttendance));
    };

    const getAttendanceForDate = (date) => {
        return attendanceData.filter(record => record.date === date);
    };

    const getStaffAttendance = (employeeId, month) => {
        return attendanceData.filter(record => 
            record.employeeId === employeeId && record.date.startsWith(month)
        );
    };

    const calculateMonthlySalary = (employeeId, month) => {
        const employee = staff.find(emp => emp.id === employeeId);
        if (!employee) return { baseSalary: 0, earnedSalary: 0, presentDays: 0, workingDays: 0 };
        
        const staffAttendance = getStaffAttendance(employeeId, month);
        const presentDays = staffAttendance.filter(record => record.status === 'present').length;
        const workingDays = staffAttendance.length;
        
        // If no attendance marked, assume full month present
        const daysToConsider = workingDays > 0 ? presentDays : 30;
        const perDaySalary = employee.salary / 30;
        const earnedSalary = Math.round(perDaySalary * daysToConsider);
        
        return {
            baseSalary: employee.salary,
            earnedSalary,
            presentDays: daysToConsider,
            workingDays: workingDays > 0 ? workingDays : 30
        };
    };

    const processSalary = (employeeId, month) => {
        const salaryCalc = calculateMonthlySalary(employeeId, month);
        const employee = staff.find(emp => emp.id === employeeId);
        
        if (!employee) {
            alert('Employee not found!');
            return;
        }
        
        const bonus = bonusAmount[`${employeeId}-${month}`] || 0;
        const earnedAmount = salaryCalc.earnedSalary + parseInt(bonus);
        
        if (earnedAmount <= 0) {
            alert('Cannot process salary. Amount is 0. Please check attendance records.');
            return;
        }
        
        const salaryRecord = {
            id: Date.now(),
            employeeId,
            month,
            baseSalary: employee.salary,
            earnedSalary: salaryCalc.earnedSalary,
            bonus: parseInt(bonus),
            overtime: 0,
            deductions: 0,
            netSalary: earnedAmount,
            paid: true,
            paidDate: new Date().toISOString().split('T')[0]
        };
        
        const updatedSalaries = [...salaries.filter(s => !(s.employeeId === employeeId && s.month === month)), salaryRecord];
        setSalaries(updatedSalaries);
        localStorage.setItem('restaurantSalaries', JSON.stringify(updatedSalaries));
        
        // Add to expenses
        const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        const expenseEntry = {
            id: Date.now(),
            category: 'salaries',
            amount: earnedAmount,
            description: `Salary paid to ${employee.name} (${employee.role}) for ${month}${bonus > 0 ? ` (Bonus: ₹${bonus})` : ''}`,
            date: new Date().toISOString().split('T')[0]
        };
        expenses.push(expenseEntry);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Clear bonus input
        setBonusAmount(prev => ({...prev, [`${employeeId}-${month}`]: 0}));
        
        alert(`Salary processed successfully!\nEmployee: ${employee.name}\nBase: ₹${salaryCalc.earnedSalary.toLocaleString('en-IN')}${bonus > 0 ? `\nBonus: ₹${bonus.toLocaleString('en-IN')}` : ''}\nTotal: ₹${earnedAmount.toLocaleString('en-IN')}`);
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case 'chef': return 'CF';
            case 'waiter': return 'WT';
            case 'manager': return 'MG';
            case 'cleaner': return 'CL';
            default: return 'ST';
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'chef': return '#ff6b6b';
            case 'waiter': return '#4CAF50';
            case 'manager': return '#2196F3';
            case 'cleaner': return '#9C27B0';
            default: return '#6c757d';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getDaysInMonth = (month) => {
        const date = new Date(month + '-01');
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const currentMonthDays = getDaysInMonth(selectedMonth);

    return (
        <div className={Styles.staffManagement}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>Staff Management</h1>
                    <div className={Styles.stats}>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{staff.length}</span>
                            <span className={Styles.statLabel}>Total Staff</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>
                                {staff.filter(emp => emp.status === 'active').length}
                            </span>
                            <span className={Styles.statLabel}>Active</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>
                                {salaries.filter(s => s.month === selectedMonth && !s.paid).length}
                            </span>
                            <span className={Styles.statLabel}>Pending Salary</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={Styles.tabs}>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'staff' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('staff')}
                    >
                        Staff List
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'attendance' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        Attendance
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'salary' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('salary')}
                    >
                        Salary Records
                    </button>
                </div>

                {/* Staff List */}
                {activeTab === 'staff' && (
                    <div className={Styles.staffSection}>
                        <div className={Styles.formSection}>
                            <h2>Add Staff Member</h2>
                            <div className={Styles.staffForm}>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={newStaff.name}
                                        onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={newStaff.phone}
                                        onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={newStaff.email}
                                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <div className={Styles.formRow}>
                                    <select
                                        value={newStaff.role}
                                        onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                                        className={Styles.select}
                                    >
                                        <option value="chef">Chef</option>
                                        <option value="waiter">Waiter</option>
                                        <option value="manager">Manager</option>
                                        <option value="cleaner">Cleaner</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Monthly Salary"
                                        value={newStaff.salary}
                                        onChange={(e) => setNewStaff({...newStaff, salary: e.target.value})}
                                        className={Styles.input}
                                        min="0"
                                    />
                                    <input
                                        type="date"
                                        value={newStaff.joinDate}
                                        onChange={(e) => setNewStaff({...newStaff, joinDate: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <button className={Styles.addBtn} onClick={addStaff}>
                                    Add Staff
                                </button>
                            </div>
                        </div>

                        <div className={Styles.staffGrid}>
                            {staff.map(employee => (
                                <div key={employee.id} className={Styles.staffCard}>
                                    <div className={Styles.staffHeader}>
                                        <div className={Styles.staffInfo}>
                                            <div className={Styles.staffAvatar} style={{ backgroundColor: getRoleColor(employee.role) }}>
                                                {getRoleIcon(employee.role)}
                                            </div>
                                            <div>
                                                <h3>{employee.name}</h3>
                                                <span className={Styles.role}>{employee.role}</span>
                                            </div>
                                        </div>
                                        <div className={Styles.staffActions}>
                                            <button 
                                                className={Styles.statusBtn}
                                                onClick={() => updateStaffStatus(employee.id, employee.status === 'active' ? 'inactive' : 'active')}
                                            >
                                                {employee.status === 'active' ? 'Active' : 'Inactive'}
                                            </button>
                                            <button 
                                                className={Styles.deleteBtn}
                                                onClick={() => deleteStaff(employee.id)}
                                            >
                                                
                                            </button>
                                        </div>
                                    </div>
                                    <div className={Styles.staffDetails}>
                                        <p>{employee.phone}</p>
                                        <p>{employee.email}</p>
                                        <p>{formatCurrency(employee.salary)}/month</p>
                                        <p>Joined: {new Date(employee.joinDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attendance */}
                {activeTab === 'attendance' && (
                    <div className={Styles.attendanceSection}>
                        <div className={Styles.attendanceControls}>
                            <div className={Styles.monthSelector}>
                                <label>Select Month:</label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className={Styles.input}
                                />
                            </div>
                        </div>

                        <div className={Styles.attendanceGrid}>
                            <div className={Styles.attendanceHeader}>
                                <div className={Styles.headerCell}>Staff Member</div>
                                {Array.from({ length: currentMonthDays }, (_, i) => i + 1).map(day => (
                                    <div key={day} className={Styles.dayCell}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {staff.map(employee => (
                                <div key={employee.id} className={Styles.attendanceRow}>
                                    <div className={Styles.employeeCell}>
                                        <div className={Styles.employeeInfo}>
                                            <span>{getRoleIcon(employee.role)}</span>
                                            <span>{employee.name}</span>
                                        </div>
                                    </div>
                                    {Array.from({ length: currentMonthDays }, (_, i) => {
                                        const day = i + 1;
                                        const date = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
                                        const record = attendanceData.find(r => r.employeeId === employee.id && r.date === date);
                                        const isToday = new Date().toISOString().slice(0, 10) === date;
                                        
                                        return (
                                            <div key={day} className={Styles.attendanceCell}>
                                                {isToday ? (
                                                    <div className={Styles.attendanceButtons}>
                                                        <button
                                                            className={`${Styles.attendanceBtn} ${record?.status === 'present' ? Styles.present : ''}`}
                                                            onClick={() => markAttendance(employee.id, date, 'present')}
                                                        >
                                                            
                                                        </button>
                                                        <button
                                                            className={`${Styles.attendanceBtn} ${record?.status === 'absent' ? Styles.absent : ''}`}
                                                            onClick={() => markAttendance(employee.id, date, 'absent')}
                                                        >
                                                            
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={`${Styles.attendanceStatus} ${record?.status || ''}`}>
                                                        {record?.status === 'present' && ''}
                                                        {record?.status === 'absent' && ''}
                                                        {!record && '-'}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Attendance Summary */}
                        <div className={Styles.attendanceSummary}>
                            <h3>Attendance Summary</h3>
                            <div className={Styles.summaryGrid}>
                                {staff.map(employee => {
                                    const staffAttendance = getStaffAttendance(employee.id, selectedMonth);
                                    const presentDays = staffAttendance.filter(r => r.status === 'present').length;
                                    const totalDays = staffAttendance.length;
                                    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
                                    
                                    return (
                                        <div key={employee.id} className={Styles.summaryCard}>
                                            <h4>{employee.name}</h4>
                                            <div className={Styles.summaryStats}>
                                                <div className={Styles.stat}>
                                                    <span>{presentDays}</span>
                                                    <span>Present</span>
                                                </div>
                                                <div className={Styles.stat}>
                                                    <span>{totalDays}</span>
                                                    <span>Total Days</span>
                                                </div>
                                                <div className={Styles.stat}>
                                                    <span>{percentage}%</span>
                                                    <span>Attendance</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Salary Records */}
                {activeTab === 'salary' && (
                    <div className={Styles.salarySection}>
                        <div className={Styles.salaryControls}>
                            <div className={Styles.monthSelector}>
                                <label>Select Month:</label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className={Styles.input}
                                />
                            </div>
                        </div>

                        <div className={Styles.salaryGrid}>
                            {staff.map(employee => {
                                const salaryCalc = calculateMonthlySalary(employee.id, selectedMonth);
                                const salaryRecord = salaries.find(s => s.employeeId === employee.id && s.month === selectedMonth);
                                const bonusKey = `${employee.id}-${selectedMonth}`;
                                
                                return (
                                    <div key={employee.id} className={Styles.salaryCard}>
                                        <div className={Styles.salaryHeader}>
                                            <h3>{employee.name}</h3>
                                            <span className={Styles.role}>{employee.role}</span>
                                        </div>
                                        <div className={Styles.salaryDetails}>
                                            <div className={Styles.salaryRow}>
                                                <span>Base Salary:</span>
                                                <span>{formatCurrency(employee.salary)}</span>
                                            </div>
                                            <div className={Styles.salaryRow}>
                                                <span>Present Days:</span>
                                                <span>{salaryCalc.presentDays}/{salaryCalc.workingDays}</span>
                                            </div>
                                            <div className={Styles.salaryRow}>
                                                <span>Earned Salary:</span>
                                                <span className={Styles.earnedAmount}>{formatCurrency(salaryCalc.earnedSalary)}</span>
                                            </div>
                                            {!salaryRecord?.paid && (
                                                <div className={Styles.salaryRow}>
                                                    <span>Bonus:</span>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={bonusAmount[bonusKey] || ''}
                                                        onChange={(e) => setBonusAmount({...bonusAmount, [bonusKey]: e.target.value})}
                                                        className={Styles.bonusInput}
                                                        min="0"
                                                    />
                                                </div>
                                            )}
                                            {salaryRecord?.bonus > 0 && (
                                                <div className={Styles.salaryRow}>
                                                    <span>Bonus:</span>
                                                    <span className={Styles.bonusAmount}>+{formatCurrency(salaryRecord.bonus)}</span>
                                                </div>
                                            )}
                                            <div className={Styles.salaryRow}>
                                                <span>Status:</span>
                                                <span className={`${Styles.paymentStatus} ${salaryRecord?.paid ? 'paid' : 'pending'}`}>
                                                    {salaryRecord?.paid ? 'Paid' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={Styles.salaryActions}>
                                            {!salaryRecord?.paid && (
                                                <button 
                                                    className={Styles.payBtn}
                                                    onClick={() => processSalary(employee.id, selectedMonth)}
                                                >
                                                    Process Salary
                                                </button>
                                            )}
                                            {salaryRecord?.paid && (
                                                <div className={Styles.paidInfo}>
                                                    <p>Paid on: {salaryRecord.paidDate}</p>
                                                    <p>Amount: {formatCurrency(salaryRecord.netSalary)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantStaffManagement;
