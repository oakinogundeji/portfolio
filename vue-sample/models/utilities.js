'use strict';
/**
* User Model Utility functions module for the Vue RESTful Backend app
*/
//==============================================================================
/**
* Module dependencies
*/
var VueRESTfulBackendModel = require('./models');
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

function validationErr(err, res) {
  Object.keys(err.errors).forEach(function (k) {
    var msg = err.errors[k].message;
    console.error('Validation error for \'%s' +': %s', k, msg);
    return res.status(404).json({
      msg: 'Please ensure required fields are filled'});
  });
}
//---------------------------Model utilities------------------------------------
function cr8NewUser(req, res) {
  return VueRESTfulBackendModel.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    photo: req.body.photo
  }, function (err, user) {
      if(err) {
        console.error('There was an error creating the user');
        console.error(err.code);
        console.error(err.name);
        if(err.name == 'ValidationError') {
          return validationErr(err, res);
        }
        else {
          return errHandler(err);
        }
      }
      console.log('New user successfully created...');
      console.log(user.name);
      return res.json({
        msg: 'User created!',
        id: user._id,
        name: user.name
    });
  })
}
//may find several users
/*function findUser(req, res) {
  return VueRESTfulBackendModel.find({name: req.params.name}, 'name email',
    function (err, user) {
      console.log(req.params.name);
      if(err) {
        return errHandler(err);
      }
      if(user == null) {
        return res.json({msg: 'User does not exist in the dBase, please' +
        ' sign up to login as a user'});
      }
      console.log(user.name);
      //req.session.name = req.body.username;
      //console.log(JSON.stringify(req.session));
      return res.json({msg: 'Login successful'});
  });
}*/

//find just one user
function findUser(req, res) {
  return VueRESTfulBackendModel.findOne({email: req.params.email}, 'name email',
    function (err, user) {
      //console.log(req.params.email);
      if(err) {
        return errHandler(err);
      }
      if(user == null) {
        return res.json({msg: 'User does not exist in the dBase, please' +
        ' sign up to login as a user'});
      }
      console.log(user.name);
      //req.session.name = req.body.username;
      //console.log(JSON.stringify(req.session));
      return res.json(user);
  });
}
//retrieve all users
function viewAllUsers(req, res) {
  return VueRESTfulBackendModel.find({},
  function (err, users) {
    if(err) {
      return errHandler(err);
    }
    console.log(users);
    return res.json(users);
  });
}
//update a single user
function updateUser(req, res) {
  return VueRESTfulBackendModel.findOne({email: req.params.email},
  function (err, user) {
    if(err) {
      return errHandler(err);
    }
    console.log(user);
    user.name = req.body.name;
    user.email = req.body.email;
    user.photo = req.body.photo;
    user.address = req.body.address;
    user.save(function (err, user) {
      if(err) {
        return errHandler(err);
      }
      console.log('User updated: ', user);
      return res.json(user);
    });
  });
}
//delete a single user
function deleteUser(req, res) {
  return VueRESTfulBackendModel.findOneAndRemove({email: req.params.email},
 function (err, user) {
   if(err) {
     return errHandler(err);
   }
   console.log('User deleted ', user);
   return res.json(user);
 });
}
//------------------------------------------------------------------------------
//==============================================================================
/**
* Export module
*/
module.exports = {
  errHandler: errHandler,
  validationErr: validationErr,
  cr8NewUser: cr8NewUser,
  findUser: findUser,
  viewAllUsers: viewAllUsers,
  updateUser: updateUser,
  deleteUser: deleteUser
};
