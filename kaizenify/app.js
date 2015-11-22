'use strict';
/**
* Kaizenify app module
*/
//==============================================================================
/**
* Module dependencies
*/
//------------------------------------------------------------------------------
var
  express = require('express'),
  mongoose = require('mongoose'),
  path = require('path'),
  //logger = require('morgan'),
  bParser = require('body-parser'),
  session = require('express-session'),
  mongodbStore = require('connect-mongodb-session')(session);
//==============================================================================
/**
* Create the express app
*/
//------------------------------------------------------------------------------
var app = express();
//==============================================================================
/**
* Module variables
*/
var
  config = require('./config/config'),
  root = require('./routes/root'),
  env = config.env,
  port = process.env.PORT || 3030,
  host = config.host,
  dbURL = config.dbURL,
  sessionSecret = config.sessionSecret;
//------------------------------------------------------------------------------
//==============================================================================
/**
* Configurations and settings
*/
//---------------------------configure environment------------------------------
app.set('env', env);
//---------------------------configure port-------------------------------------
app.set('port', port);
//---------------------------configure host-------------------------------------
app.set('host', host);
//---------------------------define views directory-----------------------------
app.set('views', path.join(__dirname, 'views'));
//---------------------------configure template engine--------------------------
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//------------------------------------------------------------------------------
//---------------------------Set up mongodbStore for sessions persistence-------
var store = new mongodbStore(
      {
        uri: dbURL,
        collection: 'kaizenifySessions'
      }, function () {
        return console.log('mongodbStore successfully connected to dBase!');
      });

    // Catch errors
store.on('error', function(err) {
      return console.error(err);
    });
//==============================================================================
/**
* Connect to dBase
*/
//---------------------------Open dBase connection------------------------------
mongoose.connect(dbURL);
//---------------------------configure dBase event handlers---------------------
var db = mongoose.connection;
db.on('error', function (err) {
  console.error('There was a db connection error');
  return  console.error(err.message);
});
db.once('connected', function () {
  return console.log('Successfully connected to ' + dbURL);
});
db.once('disconnected', function () {
  return console.error('Successfully disconnected from ' + dbURL);
});
//---------------------------Close connection on app termination----------------
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.error('dBase connection closed due to app termination');
    return process.exit(0);
  });
});
//------------------------------------------------------------------------------
//==============================================================================
/**
* Middleware setup
*/
//app.use(logger('dev'));

app.use(bParser.json());

app.use(bParser.urlencoded({ extended: true }));

app.use(session({
  name: 'kaizenify.sess', store: store, secret: sessionSecret, resave: false,
  saveUninitialized: false}));
  //Note that the session 'name' prop has to be changed to config the
  //cookies for the app we are using

app.use(function (req, res, next) {
  console.log('Kaizenify app is in ' + env + ' mode');
  console.log('Someone connected to ' + req.url);
  return next();
});

app.use(express.static(path.join(__dirname, 'public')));
//------------------------------------------------------------------------------
//==============================================================================
/**
* Routes and route handlers
*/
//---------------------------All routes-----------------------------------------
app.use('/', root);//for serving static pages and views if any!
//==============================================================================
/**
* Export the app
*/
module.exports = app;
//------------------------------------------------------------------------------
