import { useEffect, useState } from 'react';
import { useChatContext } from '../context/chatContext';
import { useUserContext } from '../context/userContext';
import client from '../tools/axiosClient';
import socketService from '../services/socketService';
import styles from './ChatroomList.module.css';

const ChatroomList = () => {
    const { chatrooms, setChatrooms, setCurrentChatroom, createChatroom } = useChatContext();

    const handleSelectChatroom = (chatroom) => {
        setCurrentChatroom(chatroom);
    };

    return (
        <div>
            <div className={styles['chatroomListHeader']}>
                {chatrooms ? (
                    <h2>Chatrooms</h2>
                ) : (
                    <h2>You aren't in any chatrooms</h2>
                )}
                <CreateNewChatroom />
            </div>
            
            {Array.isArray(chatrooms) && chatrooms.length > 0 ? (
                <ul className='chatroomList'>
                    {chatrooms.map((chatroom) => (
                        <li 
                            className={styles['chatroomInList']} 
                            key={chatroom._id} 
                            onClick={() => handleSelectChatroom(chatroom)}
                        >
                            {
                            chatroom?.name ? ( 
                                chatroom.name 
                            ) : 
                            (
                                <p>Unknown</p>
                            ) 
                            }
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You are not part of any chatrooms</p>
            )}
        </div>
    );
};

const CreateNewChatroom = () => {
    const [creatingChatroom, setCreatingChatroom] = useState(false);

    const toggleCreatingChatroom = () => {
        setCreatingChatroom((prev) => !prev);
    };

    return (
        <>
            <button onClick={toggleCreatingChatroom}>
                {creatingChatroom ? '-' : '+'}
            </button>
            {creatingChatroom && <CreateChatroomForm setCreatingChatroom={setCreatingChatroom} />}
        </>
    )
};

const CreateChatroomForm = ({ setCreatingChatroom }) => {
    const [chatroomName, setChatroomName] = useState('');
    const [participantNames, setParticipantNames] = useState('');
    const { createChatroom } = useChatContext();

    const handleChatroomName = (e) => {
        setChatroomName(e.target.value);
    }
    const handleParticipantNames = (e) => {
        setParticipantNames(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const createChatroomPayload = Object.fromEntries(new FormData(e.target));
        try {
            await createChatroom(createChatroomPayload);
            setCreatingChatroom(false);
        } catch (error) {
            console.error('Failed to create chatroom:', error);
        }
    };
    return (
        <>
            {/* <button onClick={() => setCreatingChatroom(false)}>Cancel</button> */}
            <div>
                <form onSubmit={handleSubmit}>
                <input type="text" 
                onChange={handleChatroomName} 
                placeholder="Chatroom name"
                name="chatroomName"
                />
                <input type="text" 
                onChange={handleParticipantNames} 
                placeholder="Enter participant usernames"
                name="participantNames"
                />
                <button type="submit">Create chatroom</button>
                </form>
            </div>
        </>
    );
};

export default ChatroomList;