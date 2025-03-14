import React, { useState } from "react";
import styles from "./ChatSidebar.module.css";
import { useChatContext } from "../context/chatContext";
import { useUserContext } from "../context/userContext";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedUsers, setExpandedUsers] = useState({}); // Track expanded user actions

    const { currentChatroom } = useChatContext(); 
    const { user, addFriend, updateParticipantRole, removeParticipant } = useUserContext();

    const users = currentChatroom?.participants || [];

    // Filter users by search query
    const filteredUsers = users.filter(({ user }) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Toggle user actions visibility
    const toggleUserActions = (userId) => {
        setExpandedUsers((prev) => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    // Promote or demote user
    const handleRoleUpdate = (userId, isAdmin) => {
        const action = isAdmin ? "demote" : "promote"; 
        updateParticipantRole(userId, { action });
    };

    return (
        <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Close" : "Users"}
            </button>
            {isExpanded && (
                <div className={styles.sidebarContent}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <ul>
                        {filteredUsers.map(({ user: participant }) => (
                            <li key={participant._id} className={styles.userItem}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userAvatar}>{/* Avatar */}</span>
                                    <span className={styles.userName}>{participant.username}</span>
                                    <button 
                                        className={styles.toggleActionsBtn} 
                                        onClick={() => toggleUserActions(participant._id)}
                                    >
                                        {expandedUsers[participant._id] ? "▲" : "▼"} Actions
                                    </button>
                                </div>
                                {expandedUsers[participant._id] && ( // Show actions if expanded
                                    <div className={styles.actions}>
                                        <ul className={styles.userActions}>
                                            <button>View Profile</button>
                                            <button>Direct Message</button>
                                            <button onClick={() => removeParticipant(participant._id)}>Remove from Chat</button>
                                            <button onClick={() => handleRoleUpdate(participant._id, participant.isAdmin)}>
                                                {participant.isAdmin ? "Demote from Admin" : "Promote to Admin"}
                                            </button>
                                            <button onClick={() => addFriend(participant._id)}>
                                                Add Friend
                                            </button>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
