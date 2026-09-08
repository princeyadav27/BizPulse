import { Link } from 'react-router-dom'
import Styles from '../styles/NotFound.module.css'
import { PiArrowLeft, PiCompass } from 'react-icons/pi'

const NotFound = () => {
    return (
        <div className={Styles.wrap}>
            <div className={Styles.card}>
                <span className={Styles.icon} aria-hidden="true"><PiCompass /></span>
                <p className={Styles.code}>404</p>
                <h1 className={Styles.title}>This page drifted off the map</h1>
                <p className={Styles.text}>
                    The address you followed does not exist, or the page was moved.
                    Head back to familiar ground.
                </p>
                <div className={Styles.actions}>
                    <Link to="/" className={Styles.primary}>
                        <PiArrowLeft aria-hidden="true" /> Back to home
                    </Link>
                    <Link to="/Contact" className={Styles.secondary}>Report a problem</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
