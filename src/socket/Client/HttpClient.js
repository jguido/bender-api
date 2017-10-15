const rp = require('request-promise');

class HttpClient {

    static waitingMessage(){}


    static askForData(uri, query) {
        const options = {
            method: 'POST',
            uri: uri,
            headers: {
                "Content-Type": 'application/json'
            },
            body: {
                news: query
            },
            json: true // Automatically stringifies the body to JSON
        };

        return rp(options)
            .then(body => {
                return body
            })
            .catch(err => new Error(err));
    }
}


module.exports = HttpClient;