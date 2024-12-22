// src/context/userContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import client from '../tools/axiosClient';
import { useNavigate } from 'react-router-dom';

// Create UserContext
const UserContext = createContext();
// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);

// UserProvider component to wrap the app and provide user data
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(false); // Track loading state
    // const [error, setError] = useState(null); // Store error if authentication fails
    // Use effect to fetch user data or validate the JWT token
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken'); // Retrieve accessToken from localStorage
                if (!accessToken) {
                    setLoading(false); // No token, stop loading
                    return;
                }

                // Make an API request to validate the token and fetch user info
                const response = await client.get('/api/user', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                setUser(response.data); // Store user data
            } catch (error) {
                console.error('Authentication failed:', error);
                setError('Failed to authenticate. Please log in again.');
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchUser(); // Call the fetchUser function when the component mounts
    }, []); // Empty dependency array ensures this effect runs only once

    const login = (accessToken, refreshToken, _id) => {
        setUser({
          loggedIn: true,
          accessToken,
          refreshToken,
          _id,
        });
        localStorage.setItem('accessToken', accessToken); // Store tokens in localStorage
        localStorage.setItem('refreshToken', refreshToken);
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('accessToken'); // Remove tokens from localStorage
        localStorage.removeItem('refreshToken');
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
