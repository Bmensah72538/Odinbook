// src/components/Chatroom.js

import { useState, useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import socketService from '../services/socketService';
import client from '../tools/axiosClient';
import { useUserContext } from '../context/userContext';

const Chatroom = () => {
    const { currentChatroom, setCurrentChatroom } = useChatContext();
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
            // Fetch messages from database
            const databaseResponse = await client.get(`/api/chat/${currentChatroom._id}/messages`);
            const databaseMessages = databaseResponse.data.messages;
            console.log('Fetched initial messages from database: ', databaseMessages);
            // Add usernames to messages
            for (let i = 0; i < databaseMessages.length; i++) {
                databaseMessages[i].authorUsername = await getUsernameFromId(databaseMessages[i].author);
            }
            setMessages(databaseMessages);
        } catch (error) {
            console.error('Failed to fetch initial messages from database.');
        }
    };
    
    const handleSendMessage = async () => {
        const messagePayload = {
            chatroomId: currentChatroom._id,
            messageText: newMessage, 
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
        <>
        <div>
            <div>
                { ( Array.isArray(messages) && messages.length > 0 ) ? 
                    (
                        messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.authorUsername}</strong> {msg.date}: {msg.messageText}
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
        <button onClick={()=>{
            setCurrentChatroom(null);
        }}>Go back</button>
        </>
    );
};

export default Chatroom;
