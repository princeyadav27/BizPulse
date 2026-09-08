import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const loginStatus = localStorage.getItem('isLoggedIn');
        
        if (!loginStatus) {
            navigate('/Login');
        } else {
            setIsLoggedIn(true);
        }
    }, [navigate]);

    if (isLoggedIn === null) {
        return <div>Loading...</div>; // or a loading spinner
    }

    return isLoggedIn ? children : null;
};

export default AuthGuard;
