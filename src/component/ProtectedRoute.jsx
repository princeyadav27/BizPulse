import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoggedIn) {
            // Show alert and redirect to signup
            alert('Please create an account or login to access this page.');
            navigate('/Signup');
        }
    }, [navigate]);

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? children : null;
};

export default ProtectedRoute;
