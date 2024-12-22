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
    const isFirstRender = useRef(true); // Track if this is the first render
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        // Skip initialization on first render (on mount)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Only initialize socket if currentChatroom changes
        if (user && currentChatroom?._id && accessToken) {
            const initializeSocket = async () => {
                if (!socketInitialized.current) {
                    try {
                        socketService.connect(accessToken);
                        socketInitialized.current = true;
                        console.log('Connected to socket.');
                    } catch (error) {
                        console.error('Failed to connect to socket.', error);
                    }
                }
            };

            initializeSocket();
        }

        return () => {
            if (socketInitialized.current) {
                socketService.disconnect();
                socketInitialized.current = false;
                console.log('Disconnected from socket.');
            }
        };
    }, [currentChatroom]); // Trigger only when `currentChatroom` changes

    // Connect to chatroom when `currentChatroom` changes
    useEffect(() => {
        if (currentChatroom?._id && user?._id) {
            const joinChatroomPayload = {
                userId: user._id,
                chatroomId: currentChatroom._id,
            };
            console.log(`Attempting to join chatroom as ${user._id}`, currentChatroom);
            socketService.joinChatroom(joinChatroomPayload);
        }
    }, [currentChatroom, user]); // Only run when `currentChatroom` or `user` changes

    return (
        <ChatContext.Provider value={{ chatrooms, setChatrooms, currentChatroom, setCurrentChatroom }}>
            {children}
        </ChatContext.Provider>
    );
};
