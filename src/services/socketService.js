// socketService.js
import { io } from 'socket.io-client';

const apiURL = import.meta.env.VITE_API_URL;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(apiURL, {
      auth: { token }, // Send the token for authentication
    });
  }

  joinChatroom(joinChatroomPayload) {
    this.socket.emit('joinChatroom', joinChatroomPayload);
  }

  sendMessage(messagePayload) {
    this.socket.emit('sendMessage', messagePayload);
  }

  getMessages(chatroomId, callback) {
    this.socket.on('getMessages', callback);
  }

  onNewMessage(callback) {
    this.socket.on('newMessage', callback);
  }

  onError(callback) {
    this.socket.on('error', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();
export default socketService;
