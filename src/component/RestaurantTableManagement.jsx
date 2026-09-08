import { useState, useEffect } from 'react'
import Styles from '../styles/RestaurantTableManagement.module.css'
import { PiTrash } from 'react-icons/pi'

const RestaurantTableManagement = () => {
    const [tables, setTables] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('tables');
    const [newTable, setNewTable] = useState({
        number: '',
        capacity: 4,
        location: 'ground_floor',
        status: 'available'
    });
    const [newReservation, setNewReservation] = useState({
        customerName: '',
        customerPhone: '',
        tableNumber: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        guests: 2,
        specialRequests: ''
    });

    useEffect(() => {
        loadTables();
        loadReservations();
    }, []);

    const loadTables = () => {
        const savedTables = localStorage.getItem('restaurantTables');
        if (savedTables) {
            setTables(JSON.parse(savedTables));
        }
    };

    const loadReservations = () => {
        const savedReservations = localStorage.getItem('restaurantReservations');
        if (savedReservations) {
            setReservations(JSON.parse(savedReservations));
        }
    };

    const saveTables = (tableList) => {
        setTables(tableList);
        localStorage.setItem('restaurantTables', JSON.stringify(tableList));
    };

    const saveReservations = (reservationList) => {
        setReservations(reservationList);
        localStorage.setItem('restaurantReservations', JSON.stringify(reservationList));
    };

    const addTable = () => {
        if (newTable.number && newTable.capacity) {
            const table = {
                id: Date.now(),
                ...newTable,
                capacity: parseInt(newTable.capacity)
            };
            saveTables([...tables, table]);
            setNewTable({
                number: '',
                capacity: 4,
                location: 'ground_floor',
                status: 'available'
            });
        }
    };

    const deleteTable = (id) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            saveTables(tables.filter(table => table.id !== id));
        }
    };

    const updateTableStatus = (id, status) => {
        const updatedTables = tables.map(table => 
            table.id === id ? { ...table, status } : table
        );
        saveTables(updatedTables);
    };

    const assignOrderToTable = (tableId, orderId) => {
        const updatedTables = tables.map(table => 
            table.id === tableId ? { ...table, currentOrder: orderId, status: 'occupied' } : table
        );
        saveTables(updatedTables);
    };

    const releaseTable = (tableId) => {
        const updatedTables = tables.map(table => 
            table.id === tableId ? { ...table, currentOrder: null, status: 'available' } : table
        );
        saveTables(updatedTables);
    };

    const addReservation = () => {
        if (newReservation.customerName && newReservation.tableNumber && newReservation.date) {
            const reservation = {
                id: Date.now(),
                ...newReservation,
                guests: parseInt(newReservation.guests),
                status: 'confirmed'
            };
            saveReservations([...reservations, reservation]);
            
            // Update table status to reserved
            updateTableStatus(
                tables.find(t => t.number === newReservation.tableNumber)?.id,
                'reserved'
            );
            
            setNewReservation({
                customerName: '',
                customerPhone: '',
                tableNumber: '',
                date: new Date().toISOString().split('T')[0],
                time: '19:00',
                guests: 2,
                specialRequests: ''
            });
        }
    };

    const deleteReservation = (id) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            const reservation = reservations.find(r => r.id === id);
            if (reservation) {
                // Release table
                const table = tables.find(t => t.number === reservation.tableNumber);
                if (table && table.status === 'reserved') {
                    updateTableStatus(table.id, 'available');
                }
            }
            saveReservations(reservations.filter(r => r.id !== id));
        }
    };

    const updateReservationStatus = (id, status) => {
        const updatedReservations = reservations.map(reservation => 
            reservation.id === id ? { ...reservation, status } : reservation
        );
        saveReservations(updatedReservations);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'available': return '#28a745';
            case 'occupied': return '#ffc107';
            case 'reserved': return '#17a2b8';
            case 'maintenance': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'available': return 'Available';
            case 'occupied': return 'Occupied';
            case 'reserved': return 'Reserved';
            case 'maintenance': return 'Maintenance';
            default: return 'Unknown';
        }
    };

    const getLocationText = (location) => {
        switch(location) {
            case 'ground_floor': return 'Ground Floor';
            case 'first_floor': return 'First Floor';
            case 'outdoor': return 'Outdoor';
            case 'private_room': return 'Private Room';
            default: return location;
        }
    };

    const getAvailableTables = () => {
        return tables.filter(table => table.status === 'available');
    };

    const getTableStatus = (tableNumber, date, time) => {
        // Check if table is reserved for the given date and time
        const reservation = reservations.find(r => 
            r.tableNumber === tableNumber && 
            r.date === date && 
            Math.abs(new Date(`2000-01-01 ${r.time}`).getHours() - new Date(`2000-01-01 ${time}`).getHours()) <= 1
        );
        
        if (reservation) {
            return { available: false, reason: `Reserved for ${reservation.customerName}` };
        }
        
        return { available: true, reason: 'Available' };
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className={Styles.tableManagement}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>Table Management</h1>
                    <div className={Styles.stats}>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>{tables.length}</span>
                            <span className={Styles.statLabel}>Total Tables</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>
                                {tables.filter(table => table.status === 'available').length}
                            </span>
                            <span className={Styles.statLabel}>Available</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>
                                {tables.filter(table => table.status === 'occupied').length}
                            </span>
                            <span className={Styles.statLabel}>Occupied</span>
                        </div>
                        <div className={Styles.statCard}>
                            <span className={Styles.statNumber}>
                                {reservations.filter(r => r.status === 'confirmed').length}
                            </span>
                            <span className={Styles.statLabel}>Reservations</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={Styles.tabs}>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'tables' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('tables')}
                    >
                        Tables
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'reservations' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('reservations')}
                    >
                        Reservations
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'layout' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('layout')}
                    >
                        Layout
                    </button>
                </div>

                {/* Tables Management */}
                {activeTab === 'tables' && (
                    <div className={Styles.tablesSection}>
                        <div className={Styles.formSection}>
                            <h2>Add New Table</h2>
                            <div className={Styles.tableForm}>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Table Number (e.g., T9)"
                                        value={newTable.number}
                                        onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <select
                                        value={newTable.capacity}
                                        onChange={(e) => setNewTable({...newTable, capacity: e.target.value})}
                                        className={Styles.select}
                                    >
                                        <option value="2">2 Seats</option>
                                        <option value="4">4 Seats</option>
                                        <option value="6">6 Seats</option>
                                        <option value="8">8 Seats</option>
                                        <option value="10">10 Seats</option>
                                    </select>
                                    <select
                                        value={newTable.location}
                                        onChange={(e) => setNewTable({...newTable, location: e.target.value})}
                                        className={Styles.select}
                                    >
                                        <option value="ground_floor">Ground Floor</option>
                                        <option value="first_floor">First Floor</option>
                                        <option value="outdoor">Outdoor</option>
                                        <option value="private_room">Private Room</option>
                                    </select>
                                </div>
                                <button className={Styles.addBtn} onClick={addTable}>
                                    Add Table
                                </button>
                            </div>
                        </div>

                        <div className={Styles.tablesGrid}>
                            {tables.map(table => (
                                <div key={table.id} className={Styles.tableCard}>
                                    <div className={Styles.tableHeader}>
                                        <h3>{table.number}</h3>
                                        <div className={Styles.tableActions}>
                                            <button 
                                                className={Styles.deleteBtn}
                                                onClick={() => deleteTable(table.id)}
                                            ><PiTrash aria-hidden="true" /></button>
                                        </div>
                                    </div>
                                    <div className={Styles.tableDetails}>
                                        <div className={Styles.detailRow}>
                                            <span>Capacity:</span>
                                            <span>{table.capacity} seats</span>
                                        </div>
                                        <div className={Styles.detailRow}>
                                            <span>Location:</span>
                                            <span>{getLocationText(table.location)}</span>
                                        </div>
                                        <div className={Styles.detailRow}>
                                            <span>Status:</span>
                                            <span 
                                                className={Styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(table.status) }}
                                            >
                                                {getStatusText(table.status)}
                                            </span>
                                        </div>
                                        {table.currentOrder && (
                                            <div className={Styles.detailRow}>
                                                <span>Order:</span>
                                                <span>#{table.currentOrder}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={Styles.tableActions}>
                                        <div className={Styles.actionButtons}>
                                            <select
                                                value={table.status}
                                                onChange={(e) => updateTableStatus(table.id, e.target.value)}
                                                className={Styles.statusSelect}
                                            >
                                                <option value="available">Available</option>
                                                <option value="occupied">Occupied</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="maintenance">Maintenance</option>
                                            </select>
                                            {table.status === 'occupied' && (
                                                <button 
                                                    className={Styles.releaseBtn}
                                                    onClick={() => releaseTable(table.id)}
                                                >
                                                    Release Table
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reservations */}
                {activeTab === 'reservations' && (
                    <div className={Styles.reservationsSection}>
                        <div className={Styles.formSection}>
                            <h2>New Reservation</h2>
                            <div className={Styles.reservationForm}>
                                <div className={Styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="Customer Name"
                                        value={newReservation.customerName}
                                        onChange={(e) => setNewReservation({...newReservation, customerName: e.target.value})}
                                        className={Styles.input}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={newReservation.customerPhone}
                                        onChange={(e) => setNewReservation({...newReservation, customerPhone: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <div className={Styles.formRow}>
                                    <select
                                        value={newReservation.tableNumber}
                                        onChange={(e) => setNewReservation({...newReservation, tableNumber: e.target.value})}
                                        className={Styles.select}
                                    >
                                        <option value="">Select Table</option>
                                        {getAvailableTables().map(table => (
                                            <option key={table.id} value={table.number}>
                                                {table.number} ({table.capacity} seats) - {getLocationText(table.location)}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        value={newReservation.date}
                                        onChange={(e) => setNewReservation({...newReservation, date: e.target.value})}
                                        className={Styles.input}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <input
                                        type="time"
                                        value={newReservation.time}
                                        onChange={(e) => setNewReservation({...newReservation, time: e.target.value})}
                                        className={Styles.input}
                                    />
                                </div>
                                <div className={Styles.formRow}>
                                    <input
                                        type="number"
                                        placeholder="Number of Guests"
                                        value={newReservation.guests}
                                        onChange={(e) => setNewReservation({...newReservation, guests: e.target.value})}
                                        className={Styles.input}
                                        min="1"
                                        max="20"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Special Requests (Optional)"
                                        value={newReservation.specialRequests}
                                        onChange={(e) => setNewReservation({...newReservation, specialRequests: e.target.value})}
                                        className={Styles.input}
                                        style={{ flex: 2 }}
                                    />
                                </div>
                                <button className={Styles.addBtn} onClick={addReservation}>
                                    Make Reservation
                                </button>
                            </div>
                        </div>

                        <div className={Styles.reservationsGrid}>
                            {reservations.map(reservation => (
                                <div key={reservation.id} className={Styles.reservationCard}>
                                    <div className={Styles.reservationHeader}>
                                        <div className={Styles.customerInfo}>
                                            <h3>{reservation.customerName}</h3>
                                            <p>{reservation.customerPhone}</p>
                                        </div>
                                        <div className={Styles.reservationActions}>
                                            <button 
                                                className={Styles.deleteBtn}
                                                onClick={() => deleteReservation(reservation.id)}
                                            ><PiTrash aria-hidden="true" /></button>
                                        </div>
                                    </div>
                                    <div className={Styles.reservationDetails}>
                                        <div className={Styles.detailRow}>
                                            <span>Table:</span>
                                            <span>{reservation.tableNumber}</span>
                                        </div>
                                        <div className={Styles.detailRow}>
                                            <span>Date:</span>
                                            <span>{new Date(reservation.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className={Styles.detailRow}>
                                            <span>Time:</span>
                                            <span>{formatTime(reservation.time)}</span>
                                        </div>
                                        <div className={Styles.detailRow}>
                                            <span>Guests:</span>
                                            <span>{reservation.guests} people</span>
                                        </div>
                                        <div className={Styles.detailRow}>
                                            <span>Status:</span>
                                            <span className={`${Styles.statusBadge} ${reservation.status}`}>
                                                {reservation.status}
                                            </span>
                                        </div>
                                        {reservation.specialRequests && (
                                            <div className={Styles.specialRequests}>
                                                <strong>Special Requests:</strong>
                                                <p>{reservation.specialRequests}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className={Styles.reservationFooter}>
                                        <select
                                            value={reservation.status}
                                            onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                                            className={Styles.statusSelect}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Layout View */}
                {activeTab === 'layout' && (
                    <div className={Styles.layoutSection}>
                        <h2>Restaurant Layout</h2>
                        
                        <div className={Styles.floorPlan}>
                            <div className={Styles.floor}>
                                <h3>Ground Floor</h3>
                                <div className={Styles.layoutGrid}>
                                    {tables.filter(table => table.location === 'ground_floor').map(table => (
                                        <div 
                                            key={table.id} 
                                            className={`${Styles.tableLayout} ${Styles[table.status]}`}
                                            onClick={() => updateTableStatus(table.id, table.status === 'available' ? 'occupied' : 'available')}
                                        >
                                            <div className={Styles.tableNumber}>{table.number}</div>
                                            <div className={Styles.tableCapacity}>{table.capacity}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className={Styles.floor}>
                                <h3>First Floor</h3>
                                <div className={Styles.layoutGrid}>
                                    {tables.filter(table => table.location === 'first_floor').map(table => (
                                        <div 
                                            key={table.id} 
                                            className={`${Styles.tableLayout} ${Styles[table.status]}`}
                                            onClick={() => updateTableStatus(table.id, table.status === 'available' ? 'occupied' : 'available')}
                                        >
                                            <div className={Styles.tableNumber}>{table.number}</div>
                                            <div className={Styles.tableCapacity}>{table.capacity}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={Styles.legend}>
                            <h4>Legend:</h4>
                            <div className={Styles.legendItems}>
                                <div className={Styles.legendItem}>
                                    <div className={`${Styles.legendBox} ${Styles.available}`}></div>
                                    <span>Available</span>
                                </div>
                                <div className={Styles.legendItem}>
                                    <div className={`${Styles.legendBox} ${Styles.occupied}`}></div>
                                    <span>Occupied</span>
                                </div>
                                <div className={Styles.legendItem}>
                                    <div className={`${Styles.legendBox} ${Styles.reserved}`}></div>
                                    <span>Reserved</span>
                                </div>
                                <div className={Styles.legendItem}>
                                    <div className={`${Styles.legendBox} ${Styles.maintenance}`}></div>
                                    <span>Maintenance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantTableManagement;
