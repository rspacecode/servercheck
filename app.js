let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let debug = require('debug')('servercheck:server');
let http = require('http');


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let nodemailer = require("nodemailer");


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/**
 * Module dependencies.
 */


/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '1515');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log("SERVER STARTED...")
}

let stopTime = 0;
const axios = require('axios').default;
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIyMjIyMiIsIm5hbWUiOiJTdXBlciBBZG1pbiIsInBhc3N3b3JkIjoiR3V5NjExSmFiNDAwIiwicm9vdCI6eyJzdWJTZWN0aW9uSWQiOiI1ZDFkZTYxYmQyMzFjMzEwNDA2OTFmZjAiLCJzZWN0aW9uSWQiOiI1ZDFkZTYxYmQyMzFjMzEwNDA2OTFmZWYiLCJmbG9vcklkIjoiNWQxZGU2MWJkMjMxYzMxMDQwNjkxZmVlIiwiYnJhbmNoSWQiOiI1ZDFkZTYxYmQyMzFjMzEwNDA2OTFmZWQiLCJjb21wYW55SWQiOiI1ZDFkZTYxYmQyMzFjMzEwNDA2OTFmZWMifSwiZW1wSWQiOiJhZG1pbkBzcGFjZWNvZGUuY29tIiwidXNlcnR5cGUiOiJzdXBlckFkbWluIiwiaWF0IjoxNjE3NjE2NzA1LCJleHAiOjE5OTI4NTcxOTR9.tMM6zQkCUnb313HKFqs1co5-NAN7K7oH_Z0RdGa9i5Q";

let msec = 60000;
// let msec = 1000;


setInterval(function () {
    checkServer();
}, msec);
let isEmailSent = false;
let alreadyNofityCount = 0;

// checkServer();
/*let BaseURL = "http://localhost:1010/";
let email = "mr.gauswami@gamail.com";*/

let BaseURL = "http://api.jeweltrace.in/";
let email = [
            "hitesh.patel@spacecode.com",
            "krupal.patel@spacecode.com",
            "avtish.kakadiya@spacecode.com",
            "ramesh.kata@spacecode.com",
            "muzammil.khan@spacecode.com"
            ];


function checkServer() {
    axios({
        method: 'get',
        url: BaseURL + 'company/all',
        responseType: 'json',
        headers: {
            'x-web-token': token
        }
    }).then(function (response) {
        if (!response.data.status || response.data.data_array[0] === undefined) {
            if (stopTime > 4) {
                sendEmail();
                stopTime = 0;
            } else if (stopTime === 0 || stopTime > 0) {
                stopTime = stopTime + 1;
                console.log("Server not running ." + stopTime)
            }
            // else
        } else {
            console.log("Server running good.")
            stopTime = 0;
        }

    }).catch(function (error) {
        if (stopTime > 4) {
            sendEmail();
            stopTime = 0;
        } else if (stopTime === 0 || stopTime > 0) {
            stopTime = stopTime + 1;
            console.log("Server not running ." + stopTime)
        }
    });
}

let dbEmailTemp = require("./dbTemp")

async function sendEmail() {
    if (isEmailSent) {
        alreadyNofityCount = alreadyNofityCount + 1;
        if (alreadyNofityCount > 60) {
            alreadyNofityCount = 0;
            isEmailSent = false;
        }
        return console.log("Already notify..."+alreadyNofityCount)
    } else {
        console.log("Email sent")
        isEmailSent = true;
        let transporter = nodemailer.createTransport({
            host: 'jeweltrace.in',
            port: 465,
            auth: {
                user: 'no-reply@jeweltrace.in',
                pass: 'JT@9686'
            }
        });
        let mailOptions = {
            from: 'no-reply@jeweltrace.in',
            to: email,
            subject: 'JT Production Server Alert',
            cc: 'rajesh.gauswami@spacecode.com',
            html: dbEmailTemp("Team",)
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log(error)
            } else {
                isEmailSent = true;
            }
        });
    }

}

module.exports = app;
