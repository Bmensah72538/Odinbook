// src/components/Chatroom.js

import { useState, useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import socketService from '../services/socketService';
import client from '../tools/axiosClient';
import { useUserContext } from '../context/userContext';

const Chatroom = () => {
    const { currentChatroom, setCurrentChatroom, sendMessage, messages } = useChatContext();
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async () => {
        e.preventDefault();
        try {
            sendMessage(newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message.', error);
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
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button type='submit'>Send</button>
            </form>
        </div>
        <button onClick={()=>{
            setCurrentChatroom(null);
        }}>Go back</button>
        </>
    );
};

export default Chatroom;
