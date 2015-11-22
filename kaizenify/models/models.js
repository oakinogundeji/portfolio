'use strict';
/**
* User Model module for the Vue RESTful Backend app
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
var VueRESTfulBackendSchema = new mongoose.Schema({
  //modify as needed remember, one schema/model per module!!!
      name: {type: String},
      email: {type: String, required: true},
      address: {type: [String]},
      photo: {type: String},
      //pix: {type: Buffer},//allows user to upload a pix
      createdOn: {type: Date, 'default': Date.now, required: true}
    });
//------------------------------------------------------------------------------
/**
* Create User Model and store in 'User' collection
*/
var VueRESTfulBackendModel = mongoose.model('VueRESTfulBackend', VueRESTfulBackendSchema);
//------------------------------------------------------------------------------
/**
* Export userModel
*/
module.exports = VueRESTfulBackendModel;
