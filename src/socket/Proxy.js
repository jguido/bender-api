const { Wit, log } = require('node-wit');
const AiConfig = require('../config').ai;
const messages = require('../Message');

const factory = require('./Client/FactoryClient');

const holdOn = (io) => io.emit('holdOn');
const holdOff = (io) => io.emit('holdOff');

/**
 *
 * @param {Server} io
 * @param {ServiceRegistry} serviceRegistry
 */
const handleMessage = (io, serviceRegistry) => {
    io.on('connection', function(user) {
        console.log('Client connected...');

        user.on(messages.JOIN, function(data) {
            user.emit(messages.CHAT_MESSAGE, 'Hey nice to see you!');
        });

        user.on(messages.CHAT_MESSAGE, function(message) {
            holdOn(user);

            const client = new Wit({
                accessToken: AiConfig.token,
                logger: new log.Logger(log.DEBUG)
            });

            client
                .message(message, {})
                .then(data => {
                    const resolution = factory.resolve(serviceRegistry, data, user);
                    holdOff(user);
                    if (resolution.constructor === Promise) {
                        resolution.then(res => {
                            holdOff(user);
                            if (res.constructor === Error) {
                                user.emit(messages.ANSWER_MESSAGE, res.message)
                            } else {
                                user.emit(messages.ANSWER_MESSAGE, res)
                            }
                        })
                    } else {
                        resolution.map(r => r.then(response => {
                            console.log(response);
                            holdOff(user);
                            if (response.constructor === Error) {
                                user.emit(messages.ANSWER_ERROR, response);
                            } else {
                                user.emit(messages.ANSWER_MESSAGE, response);
                            }
                        }));
                    }
                })
                .catch(e => {
                    console.error(e);
                    holdOff(user);
                });
        });

    });


};

module.exports = handleMessage;