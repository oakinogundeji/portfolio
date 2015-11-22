'use strict';
/**
* Kaizenify server module
*/
//==============================================================================
/**
* Module dependencies
*/
var
  app = require('./app'),
  http = require('http'),
  io = require('./sockets/socketio');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Instantiate server and bind 'io' to it
*/
var server = http.createServer(app);
io.listen(server);
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
  console.log('Kaizenify server listening on ' + host + ' at port ' +
   port + ' in ' + env + ' mode');
});
