'use strict';
//Init rekuire
global.rq = require('rekuire');
var logger = rq('morgan')('tiny'),
    cors = rq('cors'),
    debug = rq('debug')('app:' + process.pid),
    http = rq('http'),
    express = rq('express'),
    errorhandler = rq('errorhandler'),
    cors = rq('cors'),
    dotenv = rq('dotenv'),
    bodyParser = rq('body-parser'),
    mongoose = rq('mongoose');
//load Enviromentvariables
dotenv.load();
//Init Express
var app = express();
// MongoDB
mongoose.set('debug', false);
mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', function () {
    debug('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
    debug('Mongoose connected to the database');
});
// Parsers
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//CORS
app.use(cors());
//dev-middleware
if (process.env.MODE === 'development') {
    app.use(logger);
    app.use(errorhandler()); 
    console.log('devmode'); 
    app.use(require('connect-livereload')({    
        port:  35729  
    }));
}
//static fileserver
app.use(express.static(__dirname + '/../www'));
app.use(function (err, req, res, next) {
    if (err.name === 'StatusError') {
        res.send(err.status, err.message);
    } else {
        next(err);
    }
});
//Routes
app.use('/api/auth', rq('authRoutes'));
app.use('/api/usermanagement', rq('usermanagementRoutes'));
//Enable HTML5-Mode
app.all('/*', function (req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {
        root: __dirname + '/../www'
    });
});
//start server
var port = process.env.PORT || 3000;
http.createServer(app)
    .listen(port, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('YETI-STACK launched on PORT ' + port);
    });