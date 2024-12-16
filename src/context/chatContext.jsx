// src/context/chatContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useUserContext } from './userContext'; // Import the UserContext
import axios from 'axios';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useUserContext(); // Get user info from UserContext
    const [chatrooms, setChatrooms] = useState([]);
    const [currentChatroom, setCurrentChatroom] = useState(null);

    useEffect(() => {
        if (user) {
            // Fetch chatrooms when the user is logged in
            const fetchChatrooms = async () => {
                try {
                    const response = await axios.get('/api/chatrooms', {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    setChatrooms(response.data);
                } catch (error) {
                    console.error('Failed to fetch chatrooms:', error);
                }
            };

            fetchChatrooms();
        }
    }, [user]); // Only run this when the user is available

    return (
        <ChatContext.Provider value={{ chatrooms, setChatrooms, currentChatroom, setCurrentChatroom }}>
            {children}
        </ChatContext.Provider>
    );
};
