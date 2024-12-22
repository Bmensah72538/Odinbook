import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUserContext } from './userContext';
import socketService from '../services/socketService';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useUserContext(); // Get user info from UserContext
    const [chatrooms, setChatrooms] = useState([]);
    const [currentChatroom, setCurrentChatroom] = useState(null);
    const socketInitialized = useRef(false);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const initializeSocket = async () => {
            if (!socketInitialized.current && user && accessToken) { 
                try {
                    socketService.connect(accessToken);
                    socketInitialized.current = true;
                    console.log('Connected to socket.');
                } catch (error) {
                    console.error('Failed to connect to socket.', error);
                }
            }
        };

        if (user) {
            initializeSocket();
        }

        return () => {
            if (socketInitialized.current) {
                socketService.disconnect();
                socketInitialized.current = false;
                console.log('Disconnected from socket.');
            }
        };
    }, [user, accessToken]); // Ensure this effect only runs when `user` or `accessToken` changes

    // Connect to chatroom
    useEffect(() => {
        if (currentChatroom?._id && user?._id) {
            const joinChatroomPayload = {
                userId: user._id,
                chatroomId: currentChatroom._id,
            };
            console.log(`Attempting to join chatroom as ${user._id}`, currentChatroom);
            socketService.joinChatroom(joinChatroomPayload);
        }
    }, [currentChatroom]); // Only run if `currentChatroom` or `user` changes

    return (
        <ChatContext.Provider value={{ chatrooms, setChatrooms, currentChatroom, setCurrentChatroom }}>
            {children}
        </ChatContext.Provider>
    );
};
