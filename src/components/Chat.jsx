import { useChatContext } from "../context/chatContext";
import Chatroom from "./Chatroom";
import ChatroomList from "./ChatroomList";
const Chat = () => {
    const { currentChatroom } = useChatContext();
    console.log(currentChatroom);
    return (
        <div>
        { currentChatroom ? (<Chatroom />) : (<ChatroomList />) 
        }
        </div>
    )

};

export default Chat;