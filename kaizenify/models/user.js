'use strict';
/**
* User Model module for the Passport_Test App app
*/
//==============================================================================
/**
* Module dependencies
*/
var
  bcrypt = require('bcrypt-nodejs'),
  mongoose = require('mongoose');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Custom validators
*/
//==============================================================================
/**
* Define schema
*/
//---------------------------Define userSchema----------------------------------
var userSchema = mongoose.Schema({
    local : {
        email : String,
        password: String
    },
    facebook : {
        id : String,
        photo : String,
        email : String,
        displayName: String
    },
    twitter : {
        id : String,
        photo : String,
        displayName : String
    }
});
//------------------------------------------------------------------------------
/**
* Schema Methods
*/
//---------------------------generating a hash----------------------------------
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//---------------------------checking if password is valid----------------------
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
//------------------------------------------------------------------------------
/**
* Create User Model and store in 'User' collection
*/
var userModel = mongoose.model('User', userSchema);
//------------------------------------------------------------------------------
/**
* Export userModel
*/
module.exports = userModel;
//==============================================================================
