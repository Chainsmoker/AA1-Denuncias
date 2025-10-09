import ChatController from './chat.controller.js';
import ChatService from './chat.controller.js';

const chatController = new ChatController(new ChatService());

export {
    chatController
}