import client from '../tools/axiosClient';
import { useState, useContext } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';


function Login({}) {
    const [loggingIn, setLoggingIn] = useState(false);
    const [error, setError] = useState(null);
    const { user, login } = useUserContext();

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginPayload = Object.fromEntries(new FormData(e.target));
        setLoggingIn(true);
        setError(null); // Reset error state
        try {
            await login(loginPayload);
            setLoggingIn(false);    
        } catch (error) {
            console.error('Failed to log in. Error: ', error);
            setLoggingIn(false);
            setError('Failed to log in. Please try again.');
        }
        
        
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles['login-form']}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <button
                        type="submit"
                        className={styles['login-button']}
                        disabled={loggingIn || user }
                    >
                        {loggingIn ? 'Logging in...' : 'Log in'}
                    </button>
                </div>
            </form>
            {user && <p className={styles.success}>You are already logged in!</p>}
            {console.log(user)}
            <p>
            Don't have an account?{' '} <button onClick={() => {navigate('/signup')}}>Sign up here</button>
            </p>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

export default Login;
