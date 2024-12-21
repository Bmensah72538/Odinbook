import client from '../tools/axiosClient';
import { useState, useContext } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';


function Login({}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, login, logout } = useUserContext();

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = Object.fromEntries(new FormData(e.target));

        setLoading(true);
        setError(null); // Reset error state

        try {
            const response = await client.post('/api/login', { username, password });

            if (response.data?.error) {
                setError(response.data.error);
                return;
            }

            const { access, refresh, userId } = response.data;
            console.log(response.data);
            console.log(access);
            login(access, refresh, userId);
        } catch (error) {
            console.error('Login failed:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
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
                        disabled={loading || user }
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </div>
            </form>
            {user && <p className={styles.success}>You are already logged in!</p>}
            <p>
            Don't have an account?{' '} <button onClick={() => {navigate('/signup')}}>Sign up here</button>
            </p>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

export default Login;
