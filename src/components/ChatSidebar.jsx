import React, { useState } from "react";
import styles from "./ChatSidebar.module.css";
import { useChatContext } from "../context/chatContext";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { currentChatroom } = useChatContext(); 
    const users = currentChatroom.participants;

    console.log(currentChatroom);

    // Filter users by search query
    const filteredUsers = users.filter((user) =>
        user.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
            <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Close" : "Users"}
            </button>
            {isExpanded && (
                <div className="sidebar-content">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <ul>
                        {filteredUsers.map((user) => (
                            <li key={user._id} className="user-item">
                                <div className="user-info">
                                    <span className="user-avatar">{/* Avatar */}</span>
                                    <span className="user-name">{user.user.username}</span>
                                    {/* <span className={`status ${user.isOnline ? "online" : "offline"}`}></span> */}
                                </div>
                                <div className={styles['user-actions']}>
                                    <ul>
                                        <button>
                                            View Profile
                                        </button>
                                        <button>
                                            Direct message
                                        </button>
                                        <button>
                                            Remove from chat
                                        </button>
                                        <button>
                                            Promote to admin/Demote from admin
                                        </button>
                                        <button>
                                            Add/Remove friend 
                                        </button>
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
