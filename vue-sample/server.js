'use strict';
/**
* Vue RESTful Backend server module
*/
//==============================================================================
/**
* Module dependencies
*/
var
  app = require('./app'),
  http = require('http');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Instantiate server and bind 'io' to it
*/
var server = http.createServer(app);
//------------------------------------------------------------------------------
//==============================================================================
/**
* Module variables
*/
var
  host = app.get('host'),
  port = app.get('port'),
  env = app.get('env');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Bind server to port
*/
server.listen(app.get('port'), function () {
  console.log('Vue RESTful Backend server listening on ' + host + ' at port ' +
   port + ' in ' + env + ' mode');
});
