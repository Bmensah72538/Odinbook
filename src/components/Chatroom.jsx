// src/components/Chatroom.js

import { useState, useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import socketService from '../services/socketService';
import client from '../tools/axiosClient';
import { useUserContext } from '../context/userContext';

const Chatroom = () => {
    const { currentChatroom } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useUserContext(); 

    useEffect(() => {
        if (currentChatroom) {
            // fetch initial messages from backend
            fetchInitialMessages();
        }
    }, [currentChatroom]);

    const fetchInitialMessages = async () => {
        try {
            const databaseMessages = await client.get(`/api/chat/${currentChatroom._id}/messages`);
            setMessages(databaseMessages);
        } catch (error) {
            console.error('Failed to fetch initial messages from database.');
        }
    };
    
    const handleSendMessage = async () => {
        const messagePayload = {
            currentChatroom,
            newMessage, 
            userId: user._id,
        }
        console.log(messagePayload);
        try {
            console.log('Attempting to send message...')
            await socketService.sendMessage(messagePayload);
            console.log('Message sent! Payload: ', messagePayload)
        } catch (error) {
            console.error('Failed to send message. Payload: ', messagePayload);
        }
        
        setNewMessage('');
    };

    return (
        <div>
            <div>
                { ( Array.isArray(messages) && messages.length > 0 ) ? 
                    (
                        messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.author}</strong>: {msg.messageText}
                        </div>
                    ))
                    ) : 
                    (
                        <p>There are no messages here.</p>
                    )  
                }
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chatroom;
