import { useState } from 'react';
import client from '../tools/axiosClient.js';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import hankkiLogo from '../assets/logos/Hankki_logo.png';
import styles from './Home.module.css'

function Home({loggedIn, setLoggedIn}) {
    const [showLogin, setShowLogin] = useState('false');
    
    return (
        <>
        <div className={styles.container}>
            <div id='landing-page'>
                <div id='landing-left' className='landing-halve'>
                    <div id="logo-container">
                        <img id="logo" src={hankkiLogo} alt="Hankki_logo"></img>
                    </div>
                    <p>This is a work in progress!</p>
                </div>
                <div id='landing-right' className='landing-halve'>
                    {showLogin ? ( <Login toggleForm={() => setShowLogin(false)} />) 
                    : ( <Signup toggleForm={() => setShowLogin(true)} />)}
                </div>
            </div>
        </div>
        </>
    )
}

export default Home; 