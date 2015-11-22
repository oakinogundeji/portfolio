'use strict';
/**
* User Account Model module for the Kaizenify app
*/
//==============================================================================
/**
* Module dependencies
*/
var
  mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Custom validators
*/

/**
* Define schema
*/
//---------------------------Define Account Schema------------------------------
var AccountSchema = new mongoose.Schema({
  //modify as needed remember, one schema/model per module!!!
      email: {type: String, unique: true, required: true},
      password: {type: String, required: true}
    });
//Passport local mongoose plugin for automatic salting and hashing of user passord
AccountSchema.plugin(passportLocalMongoose);
//------------------------------------------------------------------------------
/**
* Create User Model and store in 'User' collection
*/
var AccountModel = mongoose.model('Accounts', AccountSchema);
//------------------------------------------------------------------------------
/**
* Export userModel
*/
module.exports = AccountModel;
