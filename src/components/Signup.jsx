import { useState } from 'react';
import client from '../tools/axiosClient';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

function Signup() {
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const [confirmPassword, setConfirmPassword] = useState(''); // Separate state for password confirmation
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login, logout} = useUserContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value); 
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setLoading(true); // Set loading state
        if (credentials.password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        setError(null); // Reset error state

        try {
            const response = await client.post('/api/signup', {
                ...credentials,
            });

            if (response.data?.errors) {
                setError(response.data.errors);
                setLoading(false);
                return;
            } else
            console.log(response.data.error);
            const accessToken = response.data.access.token.split(' ')[1];
            const refreshToken = response.data.refresh.token.split(' ')[1];
            const userId = response.data.userId;

            // Login user
            await login(accessToken, refreshToken, userId);
            // Navigate user to dashboard
            await navigate('/dashboard');
        } catch (err) {
            // Handle network or unexpected errors
            setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
            setLoading(false);
            console.error('Signup error:', err);
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles['signup-form']}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                    <button
                        className={styles['login-button']}
                        type="submit"
                    >
                        {loading ? ('Signing up...') : ('Sign Up')}
                    </button>
                </div>
            </form>
            {error && <div className="error">{
                Array.isArray(error) ? (
                    error.map((err, index) => (
                        <ul key={index}>{err}</ul>
                    ))
                ) : (
                    <p>error</p>
                )
                }</div>}
            <p>
                Have an account? <button onClick={() => { navigate('/'); }}>Login here</button>
            </p>
        </div>
    );
}

export default Signup;
