import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/SalesUpload.module.css'
import { PiChartLineUp } from 'react-icons/pi'

const SalesUpload = () => {
    const navigate = useNavigate();
    const [userBusiness, setUserBusiness] = useState('');
    const [salesData, setSalesData] = useState({
        date: new Date().toISOString().split('T')[0],
        petrolSales: '',
        petrolLiters: '',
        dieselSales: '',
        dieselLiters: '',
        cngSales: '',
        cngLiters: '',
        vaporRecovery: '',
        otherSales: '',
        notes: ''
    });
    const [uploadedData, setUploadedData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [excelFile, setExcelFile] = useState(null);
    const [uploadMethod, setUploadMethod] = useState('manual'); // 'manual' or 'excel'

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        console.log('SalesUpload - useEffect - User Data:', userData);
        
        if (userData) {
            const parsedData = JSON.parse(userData);
            const businessType = parsedData.businessType;
            console.log('SalesUpload - Business Type:', businessType);
            setUserBusiness(businessType);
        }
        
        const existingData = localStorage.getItem('salesData');
        console.log('SalesUpload - Existing Sales Data:', existingData);
        if (existingData) {
            const allSalesData = JSON.parse(existingData);
            console.log('SalesUpload - All Sales Data:', allSalesData);
            
            // Get current user ID for filtering
            const userData = localStorage.getItem('userData');
            const parsedUserData = JSON.parse(userData);
            const userId = parsedUserData.id || parsedUserData.userId;
            
            // Filter only current user's data
            const userSalesData = allSalesData.filter(sale => sale.userId === userId);
            console.log('SalesUpload - Filtered User Sales Data:', userSalesData);
            setUploadedData(userSalesData);
        }
    }, []);

    const getFieldLabels = () => {
        switch(userBusiness) {
            case 'restaurant':
                return {
                    field1: 'Food Sales',
                    field1Items: ['Biryani', 'Curry', 'Roti', 'Rice', 'Snacks'],
                    field2: 'Quantity',
                    field3: 'Beverage Sales',
                    field3Items: ['Tea', 'Coffee', 'Cold Drinks', 'Juice', 'Water'],
                    field4: 'Quantity',
                    field5: 'Other Sales',
                    field5Items: ['Desserts', 'Starters', 'Chinese', 'South Indian', 'Fast Food'],
                    field6: 'Quantity'
                };
            case 'retail':
                return {
                    field1: 'Product Sales',
                    field2: 'Units Sold',
                    field3: 'Accessories',
                    field4: 'Units',
                    field5: 'Other Sales',
                    field6: 'Units'
                };
            case 'service':
                return {
                    field1: 'Service Revenue',
                    field2: 'Services',
                    field3: 'Parts Sales',
                    field4: 'Parts',
                    field5: 'Other Sales',
                    field6: 'Items'
                };
            default:
                return {
                    field1: 'Petrol Sales',
                    field2: 'Petrol (Liters)',
                    field3: 'Diesel Sales',
                    field4: 'Diesel (Liters)',
                    field5: 'CNG Sales',
                    field6: 'CNG (Liters)'
                };
        }
    };

    const labels = getFieldLabels();

    const [selectedItems, setSelectedItems] = useState({
        food: '',
        beverage: '',
        other: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedData = {
            ...salesData,
            [name]: value
        };

        // Auto-calculate sales based on liters and price from stock
        const stockData = JSON.parse(localStorage.getItem('stockData') || '[]');
        console.log('SalesUpload - Stock Data:', stockData);
        console.log('SalesUpload - Input Change:', name, value);
        
        if (name === 'petrolLiters') {
            const liters = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            console.log('SalesUpload - Petrol Liters:', liters);
            
            // Try multiple fuel type names
            const petrolStock = stockData.find(item => 
                item.fuelType === 'Petrol' || 
                item.fuelType === 'petrol' || 
                item.fuelType === 'Petrol Pump'
            );
            
            console.log('SalesUpload - Petrol Stock Found:', petrolStock);
            
            if (petrolStock && liters > 0) {
                const price = parseFloat(petrolStock.pricePerLiter) || 0;
                console.log('SalesUpload - Petrol Price:', price);
                updatedData.petrolSales = (liters * price).toFixed(2);
                console.log('SalesUpload - Calculated Petrol Sales:', updatedData.petrolSales);
            }
        }
        
        if (name === 'dieselLiters') {
            const liters = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            console.log('SalesUpload - Diesel Liters:', liters);
            
            const dieselStock = stockData.find(item => 
                item.fuelType === 'Diesel' || 
                item.fuelType === 'diesel'
            );
            
            console.log('SalesUpload - Diesel Stock Found:', dieselStock);
            
            if (dieselStock && liters > 0) {
                const price = parseFloat(dieselStock.pricePerLiter) || 0;
                console.log('SalesUpload - Diesel Price:', price);
                updatedData.dieselSales = (liters * price).toFixed(2);
                console.log('SalesUpload - Calculated Diesel Sales:', updatedData.dieselSales);
            }
        }
        
        if (name === 'cngLiters') {
            const liters = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            console.log('SalesUpload - CNG Liters:', liters);
            
            const cngStock = stockData.find(item => 
                item.fuelType === 'CNG' || 
                item.fuelType === 'cng'
            );
            
            console.log('SalesUpload - CNG Stock Found:', cngStock);
            
            if (cngStock && liters > 0) {
                const price = parseFloat(cngStock.pricePerLiter) || 0;
                console.log('SalesUpload - CNG Price:', price);
                updatedData.cngSales = (liters * price).toFixed(2);
                console.log('SalesUpload - Calculated CNG Sales:', updatedData.cngSales);
            }
        }

        setSalesData(updatedData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if it's an Excel file
            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv'
            ];
            
            if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
                setExcelFile(file);
            } else {
                alert('Please upload a valid Excel file (.xlsx, .xls, .csv)');
                e.target.value = '';
            }
        }
    };

    const handleExcelUpload = async (e) => {
        e.preventDefault();
        
        if (!excelFile) {
            alert('Please select an Excel file first');
            return;
        }

        setIsUploading(true);

        // Simulate Excel file processing
        setTimeout(() => {
            // Create sample data from Excel (in real app, you'd parse the actual file)
            const userData = localStorage.getItem('userData');
            const parsedUserData = JSON.parse(userData);
            const userId = parsedUserData.id || parsedUserData.userId;
            
            const excelData = {
                id: Date.now(),
                userId: userId, // Add userId for proper filtering
                timestamp: new Date().toISOString(),
                date: salesData.date,
                petrolSales: '5000',
                petrolLiters: '100',
                dieselSales: '3000',
                dieselLiters: '60',
                cngSales: '2000',
                cngLiters: '40',
                vaporRecovery: '500',
                otherSales: '1000',
                notes: 'Data imported from Excel file',
                source: 'excel',
                fileName: excelFile.name,
                totalSales: 135000
            };

            const updatedData = [...uploadedData, excelData];
            localStorage.setItem('salesData', JSON.stringify(updatedData));
            setUploadedData(updatedData);
            
            // Dispatch storage event to notify other components
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'salesData',
                newValue: JSON.stringify(updatedData)
            }));
            
            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new CustomEvent('salesDataChanged', {
                detail: {
                    key: 'salesData',
                    newValue: JSON.stringify(updatedData)
                }
            }));

            // Reset form
            setExcelFile(null);
            setUploadMethod('manual');
            document.getElementById('excelFile').value = '';

            setIsUploading(false);
            alert('Excel data uploaded successfully!');
        }, 2000);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        // Validate required fields
        if (!salesData.petrolSales && !salesData.dieselSales && !salesData.cngSales) {
            alert('Please enter at least one sales data');
            setIsUploading(false);
            return;
        }

        // Update stock based on sales
        const stockData = JSON.parse(localStorage.getItem('stockData') || '[]');
        const updatedStock = stockData.map(item => {
            let litersUsed = 0;
            
            if (item.fuelType === 'Petrol' && salesData.petrolLiters) {
                litersUsed = parseFloat(salesData.petrolLiters.replace(/[^0-9.]/g, '')) || 0;
            } else if (item.fuelType === 'Diesel' && salesData.dieselLiters) {
                litersUsed = parseFloat(salesData.dieselLiters.replace(/[^0-9.]/g, '')) || 0;
            } else if (item.fuelType === 'CNG' && salesData.cngLiters) {
                litersUsed = parseFloat(salesData.cngLiters.replace(/[^0-9.]/g, '')) || 0;
            }
            
            if (litersUsed > 0) {
                const newStock = Math.max(0, (item.currentStock || 0) - litersUsed);
                return {
                    ...item,
                    currentStock: newStock,
                    totalSold: (item.totalSold || 0) + litersUsed,
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
            }
            return item;
        });
        
        localStorage.setItem('stockData', JSON.stringify(updatedStock));

        // Create new sales entry
        const userData = localStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id || parsedUserData.userId;
        
        const newEntry = {
            id: Date.now(),
            userId: userId, // Add userId for proper filtering
            timestamp: new Date().toISOString(),
            ...salesData,
            totalSales: (parseFloat(salesData.petrolSales) || 0) + 
                      (parseFloat(salesData.dieselSales) || 0) + 
                      (parseFloat(salesData.cngSales) || 0) +
                      (parseFloat(salesData.otherSales) || 0)
        };

        // Save to localStorage
        const updatedData = [...uploadedData, newEntry];
        localStorage.setItem('salesData', JSON.stringify(updatedData));
        setUploadedData(updatedData);
        
        // Dispatch storage event to notify other components
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'salesData',
            newValue: JSON.stringify(updatedData)
        }));
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new CustomEvent('salesDataChanged', {
            detail: {
                key: 'salesData',
                newValue: JSON.stringify(updatedData)
            }
        }));

        // Reset form
        setSalesData({
            date: new Date().toISOString().split('T')[0],
            petrolSales: '',
            petrolLiters: '',
            dieselSales: '',
            dieselLiters: '',
            cngSales: '',
            cngLiters: '',
            vaporRecovery: '',
            otherSales: '',
            notes: ''
        });

        setIsUploading(false);
        alert('Sales data uploaded and stock updated successfully!');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            const updatedData = uploadedData.filter(item => item.id !== id);
            localStorage.setItem('salesData', JSON.stringify(updatedData));
            setUploadedData(updatedData);
            
            // Dispatch storage event to notify other components
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'salesData',
                newValue: JSON.stringify(updatedData)
            }));
            
            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new CustomEvent('salesDataChanged', {
                detail: {
                    key: 'salesData',
                    newValue: JSON.stringify(updatedData)
                }
            }));
        }
    };

    const calculateDailyAnalysis = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayData = uploadedData.filter(item => item.date === today);
        
        if (todayData.length === 0) return null;

        const totals = todayData.reduce((acc, item) => {
            acc.petrol += parseFloat(item.petrolSales) || 0;
            acc.diesel += parseFloat(item.dieselSales) || 0;
            acc.cng += parseFloat(item.cngSales) || 0;
            acc.other += parseFloat(item.otherSales) || 0;
            acc.vapor += parseFloat(item.vaporRecovery) || 0;
            return acc;
        }, { petrol: 0, diesel: 0, cng: 0, other: 0, vapor: 0 });

        return {
            total: totals.petrol + totals.diesel + totals.cng + totals.other,
            petrol: totals.petrol,
            diesel: totals.diesel,
            cng: totals.cng,
            other: totals.other,
            vapor: totals.vapor,
            entries: todayData.length
        };
    };

    const todayAnalysis = calculateDailyAnalysis();

    return (
        <div className={Styles.salesUpload}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>Daily Sales Upload</h1>
                    <p>Upload your daily {userBusiness === 'restaurant' ? 'restaurant' : userBusiness === 'retail' ? 'retail store' : userBusiness === 'service' ? 'service center' : 'petrol pump'} sales data for analysis</p>
                </div>

                {/* Daily Analysis Card */}
                {todayAnalysis && (
                    <div className={Styles.analysisCard}>
                        <h2>Today's Analysis</h2>
                        <div className={Styles.analysisGrid}>
                            <div className={Styles.analysisItem}>
                                <span className={Styles.label}>Total Sales</span>
                                <span className={Styles.value}>₹{todayAnalysis.total.toFixed(2)}</span>
                            </div>
                            <div className={Styles.analysisItem}>
                                <span className={Styles.label}>Petrol</span>
                                <span className={Styles.value}>₹{todayAnalysis.petrol.toFixed(2)}</span>
                            </div>
                            <div className={Styles.analysisItem}>
                                <span className={Styles.label}>Diesel</span>
                                <span className={Styles.value}>₹{todayAnalysis.diesel.toFixed(2)}</span>
                            </div>
                            <div className={Styles.analysisItem}>
                                <span className={Styles.label}>CNG</span>
                                <span className={Styles.value}>₹{todayAnalysis.cng.toFixed(2)}</span>
                            </div>
                            <div className={Styles.analysisItem}>
                                <span className={Styles.label}>Other Sales</span>
                                <span className={Styles.value}>₹{todayAnalysis.other.toFixed(2)}</span>
                            </div>
                            <div className={Styles.analysisItem}>
                                <span className={Styles.label}>Vapor Recovery</span>
                                <span className={Styles.value}>{todayAnalysis.vapor}L</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Form */}
                <div className={Styles.uploadCard}>
                    <h2>Upload Sales Data</h2>
                    
                    {/* Upload Method Toggle */}
                    <div className={Styles.uploadMethodToggle}>
                        <button 
                            className={`${Styles.methodBtn} ${uploadMethod === 'manual' ? Styles.active : ''}`}
                            onClick={() => setUploadMethod('manual')}
                        >
                            Manual Entry
                        </button>
                        <button 
                            className={`${Styles.methodBtn} ${uploadMethod === 'excel' ? Styles.active : ''}`}
                            onClick={() => setUploadMethod('excel')}
                        >
                            Excel Upload
                        </button>
                    </div>

                    {/* Manual Upload Form */}
                    {uploadMethod === 'manual' && (
                        <form onSubmit={handleUpload} className={Styles.form}>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="date">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={salesData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {userBusiness === 'restaurant' ? (
                                <>
                                    <div className={Styles.formRow}>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="foodItem">Food Item</label>
                                            <select
                                                id="foodItem"
                                                name="foodItem"
                                                value={selectedItems.food}
                                                onChange={(e) => setSelectedItems({...selectedItems, food: e.target.value})}
                                            >
                                                <option value="">Select Food Item</option>
                                                {labels.field1Items.map(item => (
                                                    <option key={item} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="petrolLiters">{labels.field2}</label>
                                            <input
                                                type="text"
                                                id="petrolLiters"
                                                name="petrolLiters"
                                                placeholder="e.g., 50"
                                                value={salesData.petrolLiters}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="petrolSales">{labels.field1} (₹)</label>
                                            <input
                                                type="text"
                                                id="petrolSales"
                                                name="petrolSales"
                                                placeholder="Amount"
                                                value={salesData.petrolSales}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className={Styles.formRow}>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="beverageItem">Beverage Item</label>
                                            <select
                                                id="beverageItem"
                                                name="beverageItem"
                                                value={selectedItems.beverage}
                                                onChange={(e) => setSelectedItems({...selectedItems, beverage: e.target.value})}
                                            >
                                                <option value="">Select Beverage</option>
                                                {labels.field3Items.map(item => (
                                                    <option key={item} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="dieselLiters">{labels.field4}</label>
                                            <input
                                                type="text"
                                                id="dieselLiters"
                                                name="dieselLiters"
                                                placeholder="e.g., 30"
                                                value={salesData.dieselLiters}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="dieselSales">{labels.field3} (₹)</label>
                                            <input
                                                type="text"
                                                id="dieselSales"
                                                name="dieselSales"
                                                placeholder="Amount"
                                                value={salesData.dieselSales}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className={Styles.formRow}>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="otherItem">Other Item</label>
                                            <select
                                                id="otherItem"
                                                name="otherItem"
                                                value={selectedItems.other}
                                                onChange={(e) => setSelectedItems({...selectedItems, other: e.target.value})}
                                            >
                                                <option value="">Select Item</option>
                                                {labels.field5Items.map(item => (
                                                    <option key={item} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="cngLiters">{labels.field6}</label>
                                            <input
                                                type="text"
                                                id="cngLiters"
                                                name="cngLiters"
                                                placeholder="e.g., 20"
                                                value={salesData.cngLiters}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="cngSales">{labels.field5} (₹)</label>
                                            <input
                                                type="text"
                                                id="cngSales"
                                                name="cngSales"
                                                placeholder="Amount"
                                                value={salesData.cngSales}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={Styles.formRow}>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="petrolLiters">{labels.field2}</label>
                                            <input
                                                type="text"
                                                id="petrolLiters"
                                                name="petrolLiters"
                                                placeholder="e.g., 2000"
                                                value={salesData.petrolLiters}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="petrolSales">{labels.field1} (₹) - Auto</label>
                                            <input
                                                type="text"
                                                id="petrolSales"
                                                name="petrolSales"
                                                placeholder="Auto-calculated"
                                                value={salesData.petrolSales}
                                                readOnly
                                                style={{ backgroundColor: '#f0f0f0' }}
                                            />
                                        </div>
                                    </div>

                                    <div className={Styles.formRow}>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="dieselLiters">{labels.field4}</label>
                                            <input
                                                type="text"
                                                id="dieselLiters"
                                                name="dieselLiters"
                                                placeholder="e.g., 1500"
                                                value={salesData.dieselLiters}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="dieselSales">{labels.field3} (₹) - Auto</label>
                                            <input
                                                type="text"
                                                id="dieselSales"
                                                name="dieselSales"
                                                placeholder="Auto-calculated"
                                                value={salesData.dieselSales}
                                                readOnly
                                                style={{ backgroundColor: '#f0f0f0' }}
                                            />
                                        </div>
                                    </div>

                                    <div className={Styles.formRow}>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="cngLiters">{labels.field6}</label>
                                            <input
                                                type="text"
                                                id="cngLiters"
                                                name="cngLiters"
                                                placeholder="e.g., 800"
                                                value={salesData.cngLiters}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={Styles.formGroup}>
                                            <label htmlFor="cngSales">{labels.field5} (₹) - Auto</label>
                                            <input
                                                type="text"
                                                id="cngSales"
                                                name="cngSales"
                                                placeholder="Auto-calculated"
                                                value={salesData.cngSales}
                                                readOnly
                                                style={{ backgroundColor: '#f0f0f0' }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="otherSales">Other Sales (₹)</label>
                                    <input
                                        type="text"
                                        id="otherSales"
                                        name="otherSales"
                                        placeholder="Engine oil, parts, etc. (e.g., 12000)"
                                        value={salesData.otherSales}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="vaporRecovery">Vapor Recovery (Liters)</label>
                                    <input
                                        type="number"
                                        id="vaporRecovery"
                                        name="vaporRecovery"
                                        placeholder="Vapor recovery amount"
                                        value={salesData.vaporRecovery}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className={Styles.formGroup}>
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Additional notes about today's sales..."
                                    value={salesData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            <button type="submit" className={Styles.uploadBtn} disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Upload Sales Data'}
                            </button>
                        </form>
                    )}

                    {/* Excel Upload Form */}
                    {uploadMethod === 'excel' && (
                        <form onSubmit={handleExcelUpload} className={Styles.form}>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label htmlFor="date">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={salesData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={Styles.excelUploadArea}>
                                <div className={Styles.uploadIcon}><PiChartLineUp aria-hidden="true" /></div>
                                <h3>Upload Excel File</h3>
                                <p>Upload your sales data in Excel format (.xlsx, .xls, .csv)</p>
                                
                                <div className={Styles.fileInputWrapper}>
                                    <input
                                        type="file"
                                        id="excelFile"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                        className={Styles.fileInput}
                                    />
                                    <label htmlFor="excelFile" className={Styles.fileLabel}>
                                        {excelFile ? excelFile.name : 'Choose Excel File'}
                                    </label>
                                </div>

                                {excelFile && (
                                    <div className={Styles.fileInfo}>
                                        <span className={Styles.fileName}>{excelFile.name}</span>
                                        <span className={Styles.fileSize}>
                                            {(excelFile.size / 1024).toFixed(2)} KB
                                        </span>
                                    </div>
                                )}

                                <div className={Styles.excelFormat}>
                                    <h4>Expected Excel Format:</h4>
                                    <ul>
                                        <li>Petrol Sales (₹)</li>
                                        <li>Petrol (Liters)</li>
                                        <li>Diesel Sales (₹)</li>
                                        <li>Diesel (Liters)</li>
                                        <li>CNG Sales (₹)</li>
                                        <li>CNG (Liters)</li>
                                        <li>Other Sales (₹)</li>
                                        <li>Vapor Recovery (Liters)</li>
                                        <li>Stock Levels</li>
                                    </ul>
                                </div>
                            </div>

                            <button type="submit" className={Styles.uploadBtn} disabled={isUploading || !excelFile}>
                                {isUploading ? 'Processing Excel...' : 'Upload Excel File'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Recent Uploads */}
                {uploadedData.length > 0 && (
                    <div className={Styles.historyCard}>
                        <h2>Recent Uploads</h2>
                        <div className={Styles.tableContainer}>
                            <table className={Styles.table}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Petrol</th>
                                        <th>Diesel</th>
                                        <th>CNG</th>
                                        <th>Other</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedData.slice(-10).reverse().map(item => (
                                        <tr key={item.id}>
                                            <td>{item.date}</td>
                                            <td>₹{parseFloat(item.petrolSales || 0).toFixed(2)}</td>
                                            <td>₹{parseFloat(item.dieselSales || 0).toFixed(2)}</td>
                                            <td>₹{parseFloat(item.cngSales || 0).toFixed(2)}</td>
                                            <td>₹{parseFloat(item.otherSales || 0).toFixed(2)}</td>
                                            <td className={Styles.total}>₹{item.totalSales.toFixed(2)}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className={Styles.deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesUpload;
