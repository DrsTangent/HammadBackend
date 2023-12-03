var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var cors = require('cors');
require('dotenv').config();
var {infoLogger} = require('./src/logging/logger')
var {errorLogger, errorResponder, invalidPathHandler, assignHTTPError} = require('./src/middlewares/errorhandling');

global.__basedir = __dirname;

//Importing Routes//

var adminsRouter = require('./src/routes/admins');
var usersRouter = require('./src/routes/users');
var doctorsRouter = require('./src/routes/doctors');

//Starting News Job to Fetch related news from API if available.
var app = express();

//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []
console.log(whitelist);
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}

app.use(cors(corsOptions))

//Morgan's Information in Stream//
app.use(morgan('combined', {stream: infoLogger.stream}));
//Extracting Body from Request//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Cookie Parser for Cookie Secret//
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/admins', adminsRouter);
app.use('/users', usersRouter);
app.use('/doctors', doctorsRouter);

/*--------------Error Handling----------------*/

//Assign Errors to Code
app.use(assignHTTPError);

// Attach the first Error handling Middleware
// function defined above (which logs the error)
app.use(errorLogger)

// Attach the second Error handling Middleware
// function defined above (which sends back the response)
app.use(errorResponder)

// Attach the fallback Middleware
// function which sends back the response for invalid paths)
app.use(invalidPathHandler)

module.exports = app;
