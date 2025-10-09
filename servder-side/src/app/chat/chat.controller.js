export default class ChatService {
    constructor() {
    }

    async chat(req, res) {
        res.render('chat/v-chat', { title: 'Chat' });
    }
}