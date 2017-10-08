const { Wit, log } = require('node-wit');

class It {
    /**
     *
     * @param {Server} io
     * @param {string} accessToken
     */
    static run(io, accessToken) {
        const client = new Wit({
            accessToken: accessToken,
            logger: new log.Logger(log.DEBUG)
        });

        io.on('connection', function(user) {
            console.log('Client connected...');

            user.on('join', function(data) {
                console.log(data);
                user.emit('chat message', 'Hey nice to see you!');
            });

            user.on('chat message', function(message) {
                client
                    .message(message, {})
                    .then(data => user.emit('anwser message', JSON.stringify(data)))
                    .catch(console.error);
            });

        });
        //todo handle entities from wit and call micro services for gathering data
    }
}


module.exports = It;