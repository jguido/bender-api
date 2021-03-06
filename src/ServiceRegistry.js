class ServiceRegistry {

    constructor() {
        this._services = [];
        this._timeout = 30;
    }

    allKeys() {
        return Object.keys(this._services);
    }

    add(intent, ip, port, linkedKeys) {
        const key = intent+ip+port;

        if(!this._services[key]) {
            this._services[key] = {};
            this._services[key].timestamp = Math.floor(new Date() / 1000);
            this._services[key].ip = ip;
            this._services[key].port = port;
            this._services[key].uri = `http://${ip}:${port}/service`;
            this._services[key].intent = intent;
            this._services[key].linked = linkedKeys;

            console.log(`Added service for intent ${intent} on ${ip}:${port}`);
            this._cleanup();
            return;
        }

        this._services[key].timestamp = Math.floor(new Date() / 1000);
        console.log(`Updated service for intent ${intent} on ${ip}:${port}`);
        this._cleanup();
    }

    remove(intent, ip, port) {
        const key = intent + ip + port;
        delete this._services[key];
    }

    get(intent) {
        console.log('searching service for intent : '+intent);
        this._cleanup();
        for(let key in this._services) {
            if(this._services[key].intent == intent) return this._services[key];
        }
        console.log(`${intent} is not registered as service.`);
        return null;
    }

    _cleanup() {
        const now = Math.floor(new Date() / 1000);

        for(let key in this._services) {
            if(this._services[key].timestamp + this._timeout < now) {
                console.log(`Removed service for intent ${this._services[key].intent}`);
                delete this._services[key];
            }
        }
    }

}

module.exports = {
    ServiceRegistry,
    services: {
        NEWS: 'news'
    }
};