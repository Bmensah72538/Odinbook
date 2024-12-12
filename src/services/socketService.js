// socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io('your-server-url', {
      auth: { token }, // Send the token for authentication
    });
  }

  joinChatroom(chatroomId, userId) {
    this.socket.emit('joinChatroom', { chatroomId, userId });
  }

  sendMessage(chatroomId, messageText, userId) {
    this.socket.emit('sendMessage', { chatroomId, messageText, userId });
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
