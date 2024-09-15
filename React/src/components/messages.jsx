import client from "../axios/client.js"
import { useEffect, useState } from "react";

function Messages({loggedIn = false}) {
    const handleSubmit = function(e){
        e.preventDefault();
        const messageText = e.target[0].value;       
    }
    const getChats = async function() {
        const chatsRequest = await client.get('api/messages');
        console.log(chatsRequest);
        let chats = chatsRequest.data.chatrooms;
        console.log(chats);

    }
    const [chats, updateChats] = useState([])
    // let user = await client.get("/api/messages");
    let chatbox = (
        <>
            <div className="chatHistory">
                You arent in any chats.
            </div>
        </>
    )

    if(chats){ 
        chatbox = (
            <>
            <p>Hello</p>
            </>
        )
    }

    const test = (
        <>
        
        <div className="messageBox">
            <p>Send Message</p>
            <form onSubmit={handleSubmit} action="" method="post">
                <label htmlFor="messageText"></label>
                <input type="text" name="messageText" id="messageText" />
                <button type="submit">Submit</button>
            </form>
        </div>
        </>
    )
    if(loggedIn === 'true') {
        getChats();
        // if(chats.data.chatrooms) {
        //     return test
        // }
        console.log(chats);
        return ( <>
            {chatbox}
            {test}
            <p>Logged in.</p>
        </> );
    }
    return ( <><p>You need to be logged in.</p></> );
}

export default Messages