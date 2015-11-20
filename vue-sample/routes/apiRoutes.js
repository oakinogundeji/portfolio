'use strict';
/**
* Vue RESTful Backend App Router module
*/
//==============================================================================
/**
* Module dependencies
*/
var
  express = require('express'),
  config = require('../config/config'),
  VueRESTfulBackendModel = require('../models/models'),
  utilities = require('../models/utilities');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Create router instance
*/
var router = express.Router();
//------------------------------------------------------------------------------
//==============================================================================
/**
* Module variables
*/
var
  errHandler = utilities.errHandler,
  validationErr = utilities.validationErr,
  cr8NewUser = utilities.cr8NewUser,
  findUser = utilities.findUser,
  viewAllUsers = utilities.viewAllUsers,
  updateUser = utilities.updateUser,
  deleteUser = utilities.deleteUser;
//------------------------------------------------------------------------------
//==============================================================================
/**
* Middleware
*/
//------------------------------------------------------------------------------
/**
* Routes
*/
//---------------------------User route-----------------------------------------
router.route('/users')
//create a new user-------------------------------------------------------------
//---------------------------------------------accessebile at POST hostURL/user
  .post(function (req, res) {
    return cr8NewUser(req, res);
  })
//view all users in the dBase---------------------------------------------------
//------------------------------------------------accessible at GET hostURL/user
  .get(function (req, res) {
    return viewAllUsers(req, res);
  });
//find a user by 'email---------------------------------------------------------
//-----------------------------------------accessible at GET hostURL/user/:email
router.route('/users/:email')
  .get(function (req, res) {
    return findUser(req, res);
  })
//update a user-----------------------------------------------------------------
//-----------------------------------------accessible at PUT hostURL/user/:email
  .put(function (req, res) {
    return updateUser(req, res);
  })
//delete a user-----------------------------------------------------------------
//--------------------------------------accessible at DELETE hostURL/user/:email
  .delete(function (req, res) {
    return deleteUser(req, res);
  });
//
//------------------------------------------------------------------------------
//==============================================================================
/**
* Export router
*/
module.exports = router;
//------------------------------------------------------------------------------
