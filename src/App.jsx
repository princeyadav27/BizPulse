import './App.css'
import TopNav from './component/TopNav'
import DynamicSideBar from './component/DynamicSideBar'
import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initTheme } from './utils/theme'
import { getIsLoggedIn, subscribeAuth } from './utils/authEvents'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);

  useEffect(() => {
    initTheme();
  }, []);

  // React instantly to login/logout instead of polling localStorage
  useEffect(() => {
    const refresh = () => setIsLoggedIn(getIsLoggedIn());
    refresh();
    return subscribeAuth(refresh);
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
          } else {
            localStorage.setItem('isLoggedIn', 'true');
          }
        } catch (error) {
          console.error("Error loading user profile from Firebase:", error);
        }
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userData');
      }
      setIsLoggedIn(getIsLoggedIn());
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="app">
        {isLoggedIn && <DynamicSideBar />}
        <div
          className={`main-content ${isLoggedIn ? '' : 'is-public'}`}
          style={{ marginLeft: isLoggedIn ? 'var(--sidebar-width)' : '0' }}
        >
          <TopNav />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
