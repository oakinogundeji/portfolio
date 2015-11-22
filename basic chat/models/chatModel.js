'use strict';
/**
* Chat msg Model module for the Chat2 app
*/
//==============================================================================
/**
* Module dependencies
*/
var mongoose = require('mongoose');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Custom validators
*/

/**
* Define schema
*/
//---------------------------Define userSchema----------------------------------
var chatMsgSchema = new mongoose.Schema({
      sender: {
        type: String,
        required: true},
      msg: {
        type: String,
        required: true},
      createdOn: {
        type: Date,
        'default': Date.now,
        required: true}
    });
//------------------------------------------------------------------------------
/**
* Create User Model and store in 'User' collection
*/
var chatMsgModel = mongoose.model('chatMsg', chatMsgSchema);
//------------------------------------------------------------------------------
/**
* Export userModel
*/
module.exports = chatMsgModel;
