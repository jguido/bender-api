const HttpClient = require('./HttpClient');

class NewsClient extends HttpClient {
    static waitingMessage() {
        return 'Voyons voir ce que je peux trouver......';
    }
}

module.exports = NewsClient;
