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

    return (
        <ChatContext.Provider value={{ chatrooms, setChatrooms, currentChatroom, setCurrentChatroom }}>
            {children}
        </ChatContext.Provider>
    );
};
