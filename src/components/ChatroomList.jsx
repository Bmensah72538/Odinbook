// src/components/ChatroomList.js

import { useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import socketService from '../services/socketService';

const ChatroomList = () => {
    const { chatrooms, setCurrentChatroom } = useChatContext();

    const handleSelectChatroom = (chatroomId) => {
        setCurrentChatroom(chatroomId);
        socketService.joinChatroom(chatroomId);
    };

    return (
        <div>
            {chatrooms.length > 0 ? (
                <ul>
                    {chatrooms.map((chatroom) => (
                        <li key={chatroom.id} onClick={() => handleSelectChatroom(chatroom.id)}>
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
