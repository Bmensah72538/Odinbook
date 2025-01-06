import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';
import Logout from './Logout';
import styles from './Header.module.css'; // Import the CSS module


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // State to control menu visibility
    const navigate = useNavigate();  // Initialize navigate function
    const { user, logout } = useUserContext(); // Initialize user variable and logout function

    const handleNavigation = (path) => {
        navigate(path);  // Navigate to the desired path
    };

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);  // Toggle menu visibility
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1>Hankki Chat</h1>
            </div>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
                <ul>
                    <li>
                        <button onClick={() => handleNavigation('/')}>Home</button>
                    </li>
                    <li>
                        <button onClick={() => handleNavigation('/chat')}>Chat</button>
                    </li>
                    <li>
                        <button onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
                    </li>
                    { user &&
                    <li>
                        <Logout/>
                    </li>
                    }
                </ul>
            </nav>

            <div className={styles.hamburger} onClick={toggleMenu}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </div>
        </header>
    );
};

export default Header;
