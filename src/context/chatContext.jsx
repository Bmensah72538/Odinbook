import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUserContext } from './userContext';
import { useLoadingContext } from './loadingContext';
import socketService from '../services/socketService';
import client from '../tools/axiosClient';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { isLoading, setIsLoading } = useLoadingContext(); // Get loading state from LoadingContext
    const { user } = useUserContext(); // Get user info from UserContext
    const [chatrooms, setChatrooms] = useState([]);
    const [currentChatroom, setCurrentChatroom] = useState(null);
    const [messages, setMessages] = useState([]);
    const socketInitialized = useRef(false);
    const accessToken = localStorage.getItem('accessToken');

    // Initialize socket connection
    useEffect(() => {
        console.log(accessToken);
        const initializeSocket = async () => {
            console.log('Initializing socket connection...');
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
        // Initialize socket connection only if the user is logged in
        if (accessToken) {
            initializeSocket();
        };      
        return () => {
            if (socketInitialized.current) {
                socketService.disconnect();
                socketInitialized.current = false;
                console.log('Disconnected from socket.');
            }
        };
    }, []); // Only run once when the component mounts

    // Fetch chatrooms when the user is logged in
    useEffect(() => {
        if (user) {
            const fetchChatrooms = async () => {
                try {
                    setIsLoading(true);
                    const response = await client.get('/api/chat', user);
                    setChatrooms(response.data.chatrooms);
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error('Failed to fetch chatrooms:', error);
                }
            };
            fetchChatrooms();
        }
    }, [user]); // Only run when `user` changes

    // Connect to chatroom when `currentChatroom` changes
    useEffect(() => {
        if (currentChatroom?._id && user?._id) {
            const joinChatroomPayload = {
                userId: user._id,
                chatroomId: currentChatroom._id,
            };
            console.log(`Attempting to join chatroom${currentChatroom._id} as ${user._id}`);
            const joinChatroom = async () => {
                try {
                    if(!joinChatroomPayload.userId && !joinChatroomPayload.chatroomId){
                        throw new Error('Invalid joinChatroomPayload');
                    }
                    setIsLoading(true);
                    await socketService.joinChatroom(joinChatroomPayload);
                    setIsLoading(false);
                    console.log(`Joined chatroom ${currentChatroom._id}`);
                } catch (error) {
                    console.error(`Failed to join chatroom ${currentChatroom._id}`, error);
                    setIsLoading(false);
                }
            };
            joinChatroom();
            socketService.onNewMessage(handleNewMessage);
        }
    }, [currentChatroom, user]); // Only run when `currentChatroom` or `user` changes
    
    // Fetch initial messages when `currentChatroom` changes
    useEffect(() => {
        const fetchInitialMessages = async () => {
            try {
                setIsLoading(true);
                // Fetch messages from database
                const databaseResponse = await client.get(`/api/chat/${currentChatroom._id}/messages`);
                const databaseMessages = databaseResponse.data.messages;
                console.log('Fetched initial messages from database: ', databaseMessages);
                // Add usernames to messages
                for (let i = 0; i < databaseMessages.length; i++) {
                    databaseMessages[i].authorUsername = await getUsernameFromId(databaseMessages[i].author);
                }
                setMessages(databaseMessages);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Failed to fetch initial messages from database.');
            }
        };
        if (currentChatroom) {
            fetchInitialMessages();
        }
    }, [currentChatroom]);
    
    const sendMessage = async (newMessage) => {
        console.log(user);
        const messagePayload = {
            chatroomId: currentChatroom._id,
            messageText: newMessage, 
            userId: user._id,
            authorUsername: user.username,
        }
        try {
            console.log('Attempting to send message...')
            await socketService.sendMessage(messagePayload);
            console.log('Message sent! Payload: ', messagePayload)
            setMessages([...messages, messagePayload]);
        } catch (error) {
            console.error('Failed to send message. Payload: ', messagePayload, error);
        }
    };
    const handleNewMessage = async (newMessage) => {
        console.log('Received new message:', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    const createChatroom = async (createChatroomPayload) => {
        const { chatroomName, participantNames } = createChatroomPayload;
        const participants = participantNames.split(',').map(name => name.trim());
        const chatroom = {
            chatroomName,
            participants
        };
        try {
            console.log('Attempting to create chatroom...');
            const response = await client.post('/api/chat', chatroom);
            console.log(response.data);
            if(response.data.error) {
                throw new Error(response.data.error);
            }
            if(response.data.chatroom) {
                setChatrooms([...chatrooms, response.data.chatroom]);
                console.log('Chatroom created:', response.data.chatroom);
            }
        } catch (error) {
            throw new Error('Failed to create chatroom:', error);
        };
    };
    const getUsernameFromId = async (userId) => {
        let username;
        try {
            username = await client.get(`/api/user/${userId}`);
            return username.data.username;
        } catch (error) {
            console.log('Failed to get username from id');
            return 'Unknown';
        }
        
    };



    return (
        <ChatContext.Provider value={{ 
            chatrooms, 
            setChatrooms, 
            currentChatroom, 
            setCurrentChatroom, 
            messages, 
            setMessages, 
            sendMessage,
            createChatroom
        }}>
            {children}
        </ChatContext.Provider>
    );
};
