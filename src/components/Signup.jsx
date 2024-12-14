import client from '../tools/axiosClient';
import { useState } from 'react';

function Signup({ loggedIn, setLoggedIn }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Send signup request
            const response = await client.post('/api/signup', credentials);

            // Handle errors returned from the server
            if (response.data?.error) {
                setError(response.data.error);
                return;
            }

            // Extract tokens and user info from the response
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
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('Signup error:', err);
        }
    };

    return (
        <div className="signup">
            <form onSubmit={handleSubmit}>
                <div className="signup-form">
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
                    <button className="signup-button" type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Logged in: {String(loggedIn)}</p>
        </div>
    );
}

export default Signup;
