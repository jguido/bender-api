
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const io = require('socket.io')(server);
const indexRoutes = require('./routes/index');
const config = require('./src/config');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoutes);

server.listen(config.http.port, () => {
    console.log(`Server is up at http://0.0.0.0:${config.http.port}`);
    require('./src/socket/news/It').run(io, config.ai.token, serviceRegistry);
});

const ServiceRegistry = require('./src/ServiceRegistry');
const serviceRegistry = new ServiceRegistry();

app.set('_serviceRegistry', serviceRegistry);

app.put('/register/service/:intent/:port', function(req, res,next) {
    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;

    const serviceIp = req.connection.remoteAddress.includes('::')
        ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    serviceRegistry.add(serviceIntent, serviceIp, servicePort);
    res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`});
});



