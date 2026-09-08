import { useState, useEffect } from 'react'
import Styles from '../styles/Settings.module.css'
import { getTheme, setTheme } from '../utils/theme'
import { PiMonitor, PiMoon, PiSun } from 'react-icons/pi'

const Settings = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        businessType: '',
        phone: ''
    });
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [activeTheme, setActiveTheme] = useState('system');

    useEffect(() => {
        const data = localStorage.getItem('userData');
        if (data) {
            setUserData(JSON.parse(data));
        }
        setActiveTheme(getTheme());

        const handleThemeChange = () => {
            setActiveTheme(getTheme());
        };
        window.addEventListener('themeChanged', handleThemeChange);
        return () => {
            window.removeEventListener('themeChanged', handleThemeChange);
        };
    }, []);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Profile updated successfully!');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('New passwords do not match!');
            return;
        }
        alert('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handleExportData = () => {
        const data = {
            sales: JSON.parse(localStorage.getItem('salesData') || '[]'),
            stock: JSON.parse(localStorage.getItem('stockData') || '[]'),
            transactions: JSON.parse(localStorage.getItem('stockTransactions') || '[]')
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bizpulse-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure? This will delete all sales and stock data!')) {
            localStorage.removeItem('salesData');
            localStorage.removeItem('stockTransactions');
            alert('Data cleared successfully!');
        }
    };

    return (
        <div className={Styles.settings}>
            <h1>Settings</h1>

            <div className={Styles.section}>
                <h2>Profile Settings</h2>
                <form onSubmit={handleProfileUpdate}>
                    <div className={Styles.formGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                        />
                    </div>
                    <div className={Styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                        />
                    </div>
                    <div className={Styles.formGroup}>
                        <label>Business Type</label>
                        <input
                            type="text"
                            value={userData.businessType}
                            onChange={(e) => setUserData({...userData, businessType: e.target.value})}
                        />
                    </div>
                    <button type="submit" className={Styles.btnPrimary}>Update Profile</button>
                </form>
            </div>

            <div className={Styles.section}>
                <h2>App Appearance</h2>
                <p className={Styles.description}>Customize how BizPulse looks on your device. Choose between light, dark, or system matching theme.</p>
                
                <div className={Styles.themeGrid}>
                    <div 
                        className={`${Styles.themeCard} ${activeTheme === 'light' ? Styles.activeThemeCard : ''}`}
                        onClick={() => setTheme('light')}
                    >
                        <div className={`${Styles.themePreview} ${Styles.lightPreview}`}>
                            <div className={Styles.previewHeader}></div>
                            <div className={Styles.previewContent}>
                                <div className={Styles.previewItem}></div>
                                <div className={Styles.previewItem}></div>
                            </div>
                        </div>
                        <div className={Styles.themeMeta}>
                            <span className={Styles.themeIcon}><PiSun aria-hidden="true" /></span>
                            <span className={Styles.themeLabel}>Light Mode</span>
                        </div>
                    </div>

                    <div 
                        className={`${Styles.themeCard} ${activeTheme === 'dark' ? Styles.activeThemeCard : ''}`}
                        onClick={() => setTheme('dark')}
                    >
                        <div className={`${Styles.themePreview} ${Styles.darkPreview}`}>
                            <div className={Styles.previewHeader}></div>
                            <div className={Styles.previewContent}>
                                <div className={Styles.previewItem}></div>
                                <div className={Styles.previewItem}></div>
                            </div>
                        </div>
                        <div className={Styles.themeMeta}>
                            <span className={Styles.themeIcon}><PiMoon aria-hidden="true" /></span>
                            <span className={Styles.themeLabel}>Dark Mode</span>
                        </div>
                    </div>

                    <div 
                        className={`${Styles.themeCard} ${activeTheme === 'system' ? Styles.activeThemeCard : ''}`}
                        onClick={() => setTheme('system')}
                    >
                        <div className={`${Styles.themePreview} ${Styles.systemPreview}`}>
                            <div className={Styles.previewHeader}></div>
                            <div className={Styles.previewContent}>
                                <div className={Styles.previewItem}></div>
                                <div className={Styles.previewItem}></div>
                            </div>
                        </div>
                        <div className={Styles.themeMeta}>
                            <span className={Styles.themeIcon}><PiMonitor aria-hidden="true" /></span>
                            <span className={Styles.themeLabel}>System Preference</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={Styles.section}>
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                    <div className={Styles.formGroup}>
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        />
                    </div>
                    <div className={Styles.formGroup}>
                        <label>New Password</label>
                        <input
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        />
                    </div>
                    <div className={Styles.formGroup}>
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>
                    <button type="submit" className={Styles.btnPrimary}>Change Password</button>
                </form>
            </div>

            <div className={Styles.section}>
                <h2>Data Management</h2>
                <div className={Styles.actions}>
                    <button onClick={handleExportData} className={Styles.btnSecondary}>
                        Export Data
                    </button>
                    <button onClick={handleClearData} className={Styles.btnDanger}>
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
