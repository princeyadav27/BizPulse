import { useState, useEffect } from 'react'
import Styles from '../styles/StaffManagement.module.css'

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '',
        role: '',
        phone: '',
        salary: ''
    });

    useEffect(() => {
        const savedStaff = localStorage.getItem('staffData');
        if (savedStaff) {
            setStaff(JSON.parse(savedStaff));
        } else {
            const initialStaff = [
                { id: 1, name: 'Rajesh Kumar', role: 'Chef', phone: '9876543210', salary: '25000' },
                { id: 2, name: 'Priya Sharma', role: 'Waiter', phone: '9876543211', salary: '15000' },
                { id: 3, name: 'Amit Singh', role: 'Manager', phone: '9876543212', salary: '35000' }
            ];
            setStaff(initialStaff);
            localStorage.setItem('staffData', JSON.stringify(initialStaff));
        }

        const today = new Date().toISOString().split('T')[0];
        const savedAttendance = localStorage.getItem(`attendance_${today}`);
        if (savedAttendance) {
            setAttendance(JSON.parse(savedAttendance));
        }
    }, []);

    const handleAttendance = (staffId, status) => {
        const today = new Date().toISOString().split('T')[0];
        const updatedAttendance = {
            ...attendance,
            [staffId]: status
        };
        setAttendance(updatedAttendance);
        localStorage.setItem(`attendance_${today}`, JSON.stringify(updatedAttendance));
    };

    const handleAddStaff = (e) => {
        e.preventDefault();
        const newStaffMember = {
            id: Date.now(),
            ...newStaff
        };
        const updatedStaff = [...staff, newStaffMember];
        setStaff(updatedStaff);
        localStorage.setItem('staffData', JSON.stringify(updatedStaff));
        setNewStaff({ name: '', role: '', phone: '', salary: '' });
        setShowAddForm(false);
    };

    const handleDeleteStaff = (id) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
            const updatedStaff = staff.filter(s => s.id !== id);
            setStaff(updatedStaff);
            localStorage.setItem('staffData', JSON.stringify(updatedStaff));
        }
    };

    const getAttendanceCount = () => {
        const present = Object.values(attendance).filter(status => status === 'present').length;
        const absent = Object.values(attendance).filter(status => status === 'absent').length;
        return { present, absent, total: staff.length };
    };

    const counts = getAttendanceCount();

    return (
        <div className={Styles.staffManagement}>
            <div className={Styles.header}>
                <h1>Staff Management</h1>
                <button onClick={() => setShowAddForm(!showAddForm)} className={Styles.addBtn}>
                    {showAddForm ? 'Cancel' : '+ Add Staff'}
                </button>
            </div>

            <div className={Styles.summary}>
                <div className={Styles.card}>
                    <h3>Total Staff</h3>
                    <p>{staff.length}</p>
                </div>
                <div className={Styles.card}>
                    <h3>Present Today</h3>
                    <p className={Styles.present}>{counts.present}</p>
                </div>
                <div className={Styles.card}>
                    <h3>Absent Today</h3>
                    <p className={Styles.absent}>{counts.absent}</p>
                </div>
            </div>

            {showAddForm && (
                <div className={Styles.addForm}>
                    <h2>Add New Staff</h2>
                    <form onSubmit={handleAddStaff}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Role (Chef, Waiter, Manager)"
                            value={newStaff.role}
                            onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={newStaff.phone}
                            onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Salary"
                            value={newStaff.salary}
                            onChange={(e) => setNewStaff({...newStaff, salary: e.target.value})}
                            required
                        />
                        <button type="submit" className={Styles.submitBtn}>Add Staff</button>
                    </form>
                </div>
            )}

            <div className={Styles.staffList}>
                <h2>Today's Attendance</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Salary</th>
                            <th>Attendance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(member => (
                            <tr key={member.id}>
                                <td>{member.name}</td>
                                <td>{member.role}</td>
                                <td>{member.phone}</td>
                                <td>₹{member.salary}</td>
                                <td>
                                    <div className={Styles.attendanceBtns}>
                                        <button
                                            className={`${Styles.presentBtn} ${attendance[member.id] === 'present' ? Styles.active : ''}`}
                                            onClick={() => handleAttendance(member.id, 'present')}
                                        >
                                            Present
                                        </button>
                                        <button
                                            className={`${Styles.absentBtn} ${attendance[member.id] === 'absent' ? Styles.active : ''}`}
                                            onClick={() => handleAttendance(member.id, 'absent')}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteStaff(member.id)} className={Styles.deleteBtn}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffManagement;
