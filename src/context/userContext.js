// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);

// UserProvider component to wrap the app and provide user data
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Store error if authentication fails

    // Use effect to fetch user data or validate the JWT token
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
                if (!token) {
                    setLoading(false);
                    return;
                }

                // Make an API request to validate the token and fetch user info
                const response = await axios.get('/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
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
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token); // Save token in localStorage
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token'); // Remove token from localStorage
    };

    return (
        <UserContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
