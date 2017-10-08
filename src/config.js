const config = {
    http: {
        port: process.env.PORT || 8000
    },
    ai: {
        token: process.env.AI_TOKEN || 'TOKEN'
    }
};

module.exports = config;