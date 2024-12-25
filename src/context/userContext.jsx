// src/context/userContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import client from '../tools/axiosClient';

// Create UserContext
const UserContext = createContext();
// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);

// UserProvider component to wrap the app and provide user data
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(false); // Track loading state
    // const [error, setError] = useState(null); // Store error if authentication fails
    
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Check if the user is logged in when the app mounts
    useEffect(() =>{
        const checkLoggedIn = async () => {
            console.log('Checking if user is logged in...');
            if (accessToken) {
                console.log('Access token found. Logging in...');
                try {
                    setLoading(true);
                    await login({ accessToken });
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to refresh tokens. Logging out...');
                    await logout();
                    setLoading(false);
                }
            } else {
                console.log('No access token found. User is not logged in.');
                setUser(null);
            }
        };
        checkLoggedIn();
    }, [accessToken]); 

    const login = async (loginPayload) => {
        try {
            if (loginPayload.accessToken) {
                await loginWithAccessToken();
            } else if (loginPayload.username && loginPayload.password) {
                await loginWithCredentials(loginPayload);
            } else {
                console.error('Invalid login payload');
            }
        } catch (error) {
            console.error('Failed to log in. Error: ', error);
        }
    };
    
    const loginWithAccessToken = async () => {
        console.log('Logging in with access token...');
        const user = await client.get('api/user');
        setUser({
            loggedIn: true,
            _id: user.data._id,
        });
        console.log('Logged in!');
    };
    
    const loginWithCredentials = async (loginPayload) => {
        console.log('Logging in with username and password...');
        try {
            const user = await client.post('api/login', loginPayload);
            if (user.data.accessToken) {
                localStorage.setItem('accessToken', user.data.accessToken);
                console.log(`Access token set: ${user.data.accessToken}`);
                localStorage.setItem('refreshToken', user.data.refreshToken);
                console.log(`Refresh token set: ${user.data.refreshToken}`);
                setUser({
                    loggedIn: true,
                    _id: user.data._id,
                });
                console.log('Logged in!');
            } else {
                console.error('Access token not found in response');
            }
        } catch (error) {
            console.error('Failed to log in. Error: ', error);
        }
    };
    const logout = async () => {
        console.log('Logging out...')
        setUser(null);
        localStorage.removeItem('accessToken'); // Remove tokens from localStorage
        localStorage.removeItem('refreshToken');
        console.log('Logged out.');
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
