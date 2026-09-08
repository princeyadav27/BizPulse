import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const loginStatus = localStorage.getItem('isLoggedIn');

        if (!loginStatus) {
            navigate('/Login', { state: { notice: 'Sign in to continue to your workspace.' } });
        } else {
            setIsLoggedIn(true);
        }
    }, [navigate]);

    if (isLoggedIn === null) {
        return (
            <div style={{
                minHeight: '60dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.9rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 500
            }}>
                <span className="bp-spinner" style={{ color: 'var(--accent)', fontSize: '1.6rem' }} aria-hidden="true" />
                Checking your workspace
            </div>
        );
    }

    return isLoggedIn ? children : null;
};

export default AuthGuard;
