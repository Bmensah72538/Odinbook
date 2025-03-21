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
    const [accessToken, setAccessToken] = useState(null); // Store access token
    const [refreshToken, setRefreshToken] = useState(null); // Store refresh token
    // const [error, setError] = useState(null); // Store error if authentication fails

    // Add tokens to state from localStorage
    const addToken = () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if(accessToken) {
            setAccessToken(accessToken);
        }
        if(refreshToken) {
            setRefreshToken(refreshToken);
        }
    };

    // Remove tokens from localStorage
    const removeTokens = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };
    // Generate an error message and log it to the console
    const generateError = (message) => {
        const error = new Error(message);
        throw error;
    }

    // Check if the user is logged in when the app mounts
    useEffect(() =>{
        const checkLoggedIn = async () => {
            console.log('Checking if user is logged in...');
            addToken();
            if (accessToken) {
                console.log('Access token found. Logging in...');
                try {
                    setLoading(true);
                    await login({ accessToken });
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to log in with access token:', error);
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

    const signup = async (signupPayload) => {
                try {
                    console.log('Signing up...');
                    const response = await client.post('/api/signup', signupPayload);

                    if (response.data?.errors) {
                        console.log(response.data.errors);
                        throw response.data.errors;
                    }
                    if (response.data?.error) {
                        console.log(response.data.error);
                        throw response.data.error;
                    }
                    const { accessToken, refreshToken, userId } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    // Login user
                    await login({accessToken});
                    console.log('Signed up!');
                } catch (err) {
                    throw err;
                }
                setLoading(false);
    }

    const login = async (loginPayload) => {
        try {
            if (loginPayload.accessToken) {
                return await loginWithAccessToken();
            } else if (loginPayload.username && loginPayload.password) {
                return await loginWithCredentials(loginPayload);
            } else {
                generateError('Invalid login payload');
            }
        } catch (error) {
            throw error;
        }
    };
    
    const loginWithAccessToken = async () => {
        console.log('Logging in with access token...');
        try {
            const response = await client.get('api/user');
            console.log(response.data);
            setUser({
                loggedIn: true,
                _id: response.data._id,
                username: response.data.username
            });
        } catch (error) {
            setUser(null);
            removeTokens();
            throw error;
        }
        console.log('Logged in!');
    };
    
    const loginWithCredentials = async (loginPayload) => {
        console.log('Logging in with username and password...');
        try {
            const response = await client.post('api/login', loginPayload);
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                addToken();
                setUser({
                    loggedIn: true,
                    _id: response.data._id,
                    username: response.data.username,
                });
                console.log('Logged in!');
            } else {
                generateError('Failed to log in');
            }
        } catch (error) {
            throw error;
        }
    };
    const logout = async () => {
        console.log('Logging out...')
        setUser(null);
        removeTokens();
        try {
            const response = await client.post('/api/logout', user); 
        } catch (error) {
            throw error;
        } finally {
            console.log('End logout.')
            setLoading(false);
        }
        console.log('Logged out.');
    };
    const addFriend = async (friendId) => {
        console.log(friendId);
        try {
            const response = await client.post('/api/friendship', {
                friendId,
            });
            if (response.data?.error) {
                throw response.data.error;
            }
            console.log('Friend added!');
        } catch (error) {
            throw error;
        }
    };

    const removeParticipant = async (participantId) => {
        console.log(participantId);
        try {
            const response = await client.delete(`/api/chatrooms/${currentChatroom._id}/participants/${participantId}`);
            if (response.data?.error) {
                throw response.data.error;
            }
            console.log('Participant removed!');
        } catch (error) {
            throw error;
        }
    }
    const updateParticipantRole = async (participantId, role) => {
        console.log(participantId, role);
        try {
            const response = await client.put(`/api/chatrooms/${currentChatroom._id}/participants/${participantId}`, {
                role,
            });
            if (response.data?.error) {
                throw response.data.error;
            }
            console.log('Participant role updated!');
        } catch (error) {
            throw error;
        }
    }
    return (
        <UserContext.Provider value={{ user, addFriend, removeParticipant, updateParticipantRole, loading, signup, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
