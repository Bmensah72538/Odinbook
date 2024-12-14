import client from '../tools/axiosClient';
import { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';


function Login({ loggedIn, setLoggedIn, toggleForm }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
            localStorage.setItem('accessToken', access.token.split(' ')[1] || access.token);
            localStorage.setItem('refreshToken', refresh.token.split(' ')[1] || refresh.token);
            localStorage.setItem('userId', userId);
            setLoggedIn(true);
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
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Submit'}
                    </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                {loggedIn && <p className={styles.success}>You are logged in!</p>}
            </form>
            <p>
            Don't have an account?{' '} <button onClick={() => {navigate('/signup')}}>Sign up here</button>
            </p>
        </div>
    );
}

export default Login;
