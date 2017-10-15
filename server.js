
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const io = require('socket.io')(server);
const indexRoutes = require('./routes/index');
const config = require('./src/config');


const ServiceRegistry = require('./src/ServiceRegistry');
const serviceRegistry = new ServiceRegistry.ServiceRegistry();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoutes);
app.set('_serviceRegistry', serviceRegistry);

server.listen(config.http.port, () => {
    console.log(`Server is up at http://0.0.0.0:${config.http.port}`);
    require('./src/socket/Proxy')(io, serviceRegistry);
});


app.put('/register/service/:intent/:port', function(req, res,next) {
    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;
    const serviceLinkedKeys = req.body.linked;
    const serviceIp = req.ip.replace('::ffff:', '');

    serviceRegistry.add(serviceIntent, serviceIp, servicePort, serviceLinkedKeys);
    res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`});
});



