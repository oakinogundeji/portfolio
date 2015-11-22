'use strict';
//TODO Move all utilities into the 'lib' directory
/**
* Chat msg Model Utility functions module for the Chat2 app
*/
//==============================================================================
/**
* Module dependencies
*/
var chatMsgModel = require('./chatModel');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Create utility functions
*/
//---------------------------Error handlers-------------------------------------
function errHandler(err) {
  console.error('There was an error performing the operation');
  return console.error(err.message);
}
//---------------------------Model utilities------------------------------------
function cr8NewMsg(data) {
  return chatMsgModel.create({
    sender: data.sender,
    msg: data.msg
  }, function (err, msg) {
      if(err) {
        console.error('There was an error saving the message');
        console.error(err.code);
        console.error(err.name);
        return errHandler(err);
        }
      return console.log('New message successfully saved...');
    });
  }

function retrieveMsgs(num) {
  var query = chatMsgModel.find({}).sort('-createdOn').limit(num)
  .exec(function (err, msgs) {
    if(err) {
      return errHandler(err);
    }
    return socket.emit('old_msgs', msgs);
  });
}
//------------------------------------------------------------------------------
//==============================================================================
/**
* Export module
*/
module.exports = {
  errHandler: errHandler,
  cr8NewMsg: cr8NewMsg
};
