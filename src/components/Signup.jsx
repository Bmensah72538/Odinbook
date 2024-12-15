import { useState } from 'react';
import client from '../tools/axiosClient';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import useRecaptcha from '../tools/recaptcha';  // Import the custom hook

function Signup({ loggedIn, setLoggedIn }) {
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const [confirmPassword, setConfirmPassword] = useState(''); // Separate state for password confirmation
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Use the custom reCAPTCHA hook
    const { captchaToken, executeCaptcha, loaded } = useRecaptcha(import.meta.env.VITE_RECAPTCHAKEY);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value); // Update the confirm password state
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

        setError(null); // Reset error state

        try {
            // Trigger CAPTCHA validation before sending the request
            if (loaded) {
                await executeCaptcha();  // Execute reCAPTCHA here
            }

            // Send signup request with credentials and captchaToken
            const response = await client.post('/api/signup', {
                ...credentials,
                captchaToken, // Pass the token to the backend
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
            navigate('/dashboard'); // Redirect after successful signup
        } catch (err) {
            // Handle network or unexpected errors
            setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
            console.error('Signup error:', err);
        }
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

                    {/* Trigger reCAPTCHA manually on form submit */}
                    <button
                        className={styles['login-button']}
                        type="submit"
                        disabled={!loaded || !captchaToken}  // Disable if CAPTCHA is not loaded or token is not available
                    >
                        Sign Up
                    </button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Have an account? <button onClick={() => { navigate('/'); }}>Login here</button>
            </p>
        </div>
    );
}

export default Signup;
