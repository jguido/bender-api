const HttpClient = require('./HttpClient');

class ChitChatClient extends HttpClient {
    static waitingMessage() {
        return null;
    }
}

module.exports = ChitChatClient;
