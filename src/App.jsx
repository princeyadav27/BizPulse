
import './App.css'
import TopNav from './component/TopNav'
import DynamicSideBar from './component/DynamicSideBar'
import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initTheme } from './utils/theme'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initTheme();
  }, []);


  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
    };

    // Initial check
    checkLoginStatus();

    // Listen for storage changes (for login/logout)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (for same-tab updates)
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = {
              id: user.uid,
              userId: user.uid,
              email: user.email,
              ...userDoc.data()
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', user.email || '');
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Error loading user profile from Firebase:", error);
        }
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        {isLoggedIn && <DynamicSideBar />}
        <div className="main-content" style={{marginLeft: isLoggedIn ? 'var(--sidebar-width)' : '0'}}>
          <TopNav />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
