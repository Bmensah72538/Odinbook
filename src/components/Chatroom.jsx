// src/components/Chatroom.js

import { useState, useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import socketService from '../services/socketService';

const Chatroom = () => {
    const { currentChatroom } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (currentChatroom) {
            getMessages(currentChatroom, (messages) => {
                setMessages(messages);
            });

            onNewMessage((message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }
    }, [currentChatroom]);

    const handleSendMessage = () => {
        socketService.sendMessage(currentChatroom, newMessage);
        setNewMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.author}</strong>: {msg.messageText}
                    </div>
                ))}
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
