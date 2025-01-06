// src/components/Chatroom.js
import { useState, useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import styles from './Chatroom.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import he from 'he';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const Chatroom = () => {
    const { chatrooms, currentChatroom, setCurrentChatroom, sendMessage, messages } = useChatContext();
    const [newMessage, setNewMessage] = useState('');
    const activeChatroom = chatrooms.find((chatroom) => {
        return chatroom._id = currentChatroom;
    })
    const handleSendMessage = async (e) => {
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
                { ( Array.isArray(activeChatroom.messages) && activeChatroom.messages.length > 0 ) ? 
                    (
                        activeChatroom.messages.map((msg, index) => (
                        <div className={styles['chatMessage']} key={index}>
                            <strong className={styles['username']}>{msg.author.username}</strong> 
                            <p className={styles['timestamp']}>{dayjs(msg.date).fromNow()}</p>  {/* Format date here */}
                            <p className={styles['messageText']}>{he.decode(msg.messageText)}</p>
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
        <button onClick={()=>{ setCurrentChatroom(null); }}>Go back</button>
        </>
    );
};

export default Chatroom;
