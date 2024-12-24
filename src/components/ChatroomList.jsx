// src/components/ChatroomList.js

import { useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import { useUserContext } from '../context/userContext';
import client from '../tools/axiosClient';
import socketService from '../services/socketService';
import styles from './ChatroomList.module.css'

const ChatroomList = () => {
    const { chatrooms, setChatrooms, setCurrentChatroom } = useChatContext();
    const { user } = useUserContext();

    useEffect(() => {

        if (user) {
            // Fetch chatrooms when the user is logged in
            const fetchChatrooms = async () => {
                try {
                    const response = await client.get('/api/chat', user);
                    setChatrooms(response.data.chatrooms);
                } catch (error) {
                    console.error('Failed to fetch chatrooms:', error);
                }
            };
            fetchChatrooms();
        }
    }, [user]); // Only run this when the user is available

    const handleSelectChatroom = (chatroom) => {
        setCurrentChatroom(chatroom);
    };

    return (
        <div>
        {Array.isArray(chatrooms) && chatrooms.length > 0 ? (
            <ul>
                {chatrooms.map((chatroom) => (
                    <li 
                        className={styles['chatroomInList']} 
                        key={chatroom._id} 
                        onClick={() => handleSelectChatroom(chatroom)}
                    >
                        {chatroom.name}
                    </li>
                ))}
            </ul>
        ) : (
            <p>You are not part of any chatrooms</p>
        )}
        </div>

    );
};

export default ChatroomList;
