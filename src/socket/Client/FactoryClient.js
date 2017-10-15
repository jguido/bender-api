const Map = require('immutable').Map;
const messages = require('../../Message');

const resolveService = (serviceRegistry, data) => {
    let services = Map();

    Object.keys(data).map(intent => {
        const service = serviceRegistry.get(intent);
        if (service) {
            services = services.set(intent, service);
        }
    });

    return services;
};

const factoryService = classname => {
    switch (classname) {
        case 'news':
            return require('./NewsClient');
        case 'greeting':
            return require('./GreetingClient');
        case 'chitchat':
            return require('./ChitChatClient');
    }
};

class Factory {
    /**
     *
     * @param {ServiceRegistry} serviceRegistry
     * @param {object} aiAnalysis
     * @param {Server} io
     */
    static resolve(serviceRegistry, aiAnalysis, io) {
        const a = {
            "msg_id": "00bXNL6HCLYxToVWH",
            "_text": "donne moi des news sur js",
            "entities": {
                "news": [{"confidence": 1, "value": "news", "type": "value"}],
                "types": [{"confidence": 1, "value": "javascript", "type": "value"}]
            }
        };
        const actionList = resolveService(serviceRegistry, aiAnalysis.entities);

        if (actionList.size === 0) {
            return new Promise((resolve, reject) => resolve(new Error("I don't understand, soon i will be smarter :)")));
        }

        return actionList.map(service => {

            let query = {};
            if (service.linked) {
                service.linked.map(key => {
                    query[key] = aiAnalysis.entities[key][0].value
                });
            }

            const clientService = factoryService(service.intent);
            const waitingMessage = clientService.waitingMessage();
            if (waitingMessage) {
                io.emit(messages.ANSWER_MESSAGE, waitingMessage);
            }

            return clientService.askForData(`${service.uri}`, query).then(data => data);

        });
    }
}

module.exports = Factory;