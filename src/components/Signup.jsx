import client from '../tools/axiosClient';
import { useState } from 'react';
import styles from './Signup.module.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

function Signup({ loggedIn, setLoggedIn}) {
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const [confirmPassword, setConfirmPassword] = useState('');  // Separate state for password confirmation
    const [error, setError] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);

    const navigate = useNavigate();
    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);  // Store the token when CAPTCHA changes
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);  // Update the confirm password state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            alert('Please complete the CAPTCHA.');
            return;
        }

        if (credentials.password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null);  // Reset error state

        try {
            // Send signup request with credentials and captchaToken
            const response = await client.post('/api/signup', {
                ...credentials,
                confirmPassword,  // Include confirmPassword if needed on backend
                captchaToken,
            });

            if (response.data?.error) {
                setError(response.data.error);
                return;
            }

            const accessToken = response.data.access.token.split(' ')[1];
            const refreshToken = response.data.refresh.token.split(' ')[1];
            const userId = response.data.userId;

            // Store tokens in localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);

            // Update logged-in status
            setLoggedIn(true);
        } catch (err) {
            // Handle network or unexpected errors
            setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
            console.error('Signup error:', err);
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
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHAKEY}
                        onChange={handleCaptchaChange}
                    />
                    <button className={styles['login-button']} type="submit" disabled={!captchaToken}>
                        Sign Up
                    </button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Have an account? <button onClick={() => {navigate('/')}}>Login here</button>
            </p>
        </div>
    );
}

export default Signup;
