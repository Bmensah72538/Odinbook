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
