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
    const [chatrooms, setChatrooms] = useState(null);
    const [currentChatroom, setCurrentChatroom] = useState(null);
    const socketInitialized = useRef(false);
    const accessToken = localStorage.getItem('accessToken');
    const chatroomsRef = useRef(chatrooms);

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
                    socketService.onNewMessage(handleNewMessage);
                    console.log('Now listening for messages.')
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
    }, [accessToken]); // Only run if the accessToken is removed, or when component mounts

    // Fetch chatrooms when the user is logged in
    useEffect(() => {
        if (user) {
            const fetchChatrooms = async () => {
                try {
                    setIsLoading(true);
                    const response = await client.get('/api/chat', user);

                    if (!response.data || !response.data.chatrooms) {
                        throw new Error('No chatrooms found in response');
                    }
                    if(response.data.error) {
                        throw response.data.error;
                    }

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

    // Update ref whenever chatrooms changes. 
    useEffect(() => {
        chatroomsRef.current = chatrooms;
    }, [chatrooms]); 

    // Connect to chatroom sockets after chatrooms are fetched
    useEffect(() => {
        if (!user) {
            return;
        }
        if (chatrooms) {
            chatrooms.forEach((chatroom) => {
                socketService.joinChatroom({
                    userId: user._id, 
                    chatroomId: chatroom._id
                });
            });
            console.log('Connected to chatrooms:', chatrooms);
        }
    }, [user, chatrooms]); // Only run when `user` or `chatrooms` change
    
    
    const sendMessage = async (newMessage) => {
        if (!currentChatroom) {
            throw new Error('No chatroom selected.');
        }
        const messagePayload = {
            chatroomId: currentChatroom,
            messageText: newMessage, 
            userId: user._id,
            authorUsername: user.username,
        }
        try {
            console.log('Attempting to send message...')
            await socketService.sendMessage(messagePayload);
            console.log('Message sent! Payload: ', messagePayload)
            console.log(chatrooms);
        } catch (error) {
            console.error('Failed to send message. Payload: ', messagePayload, error);
        }
    };
    const handleNewMessage = async (newMessage) => {
        console.log('Received new message:', newMessage);
        const latestChatrooms = chatroomsRef.current;
        const chatroom = latestChatrooms.find(chatroom => chatroom._id === newMessage.chatroomId);
        if (chatroom) {
            const updatedChatrooms = chatroomsRef.current.map((room) => 
                room._id === chatroom._id
                    ? { ...room, messages: [...room.messages, newMessage] } 
                    : room
            );
            setChatrooms(updatedChatrooms);
        }
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



    return (
        <ChatContext.Provider value={{ 
            chatrooms, 
            setChatrooms, 
            currentChatroom, 
            setCurrentChatroom, 
            sendMessage,
            createChatroom
        }}>
            {children}
        </ChatContext.Provider>
    );
};
