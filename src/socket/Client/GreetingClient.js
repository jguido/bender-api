const HttpClient = require('./HttpClient');

class GreetingClient extends HttpClient {
    static waitingMessage() {
        return null;
    }
}

module.exports = GreetingClient;
