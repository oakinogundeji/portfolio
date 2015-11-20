'use strict';
/**
* Vue RESTful Backend App Router module
*/
//==============================================================================
/**
* Module dependencies
*/
var
  faker = require('faker'),
  express = require('express');
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
//------------------------------------------------------------------------------
//==============================================================================
/**
* Middleware
*/
//------------------------------------------------------------------------------
/**
* Routes
*/
//---------------------------Users route-----------------------------------------
router.get('/users', function (req, res) {
  var
    output = [],
    user,
    i;
  for(i = 0; i<10; i++) {
    user = {
      id: faker.random.number(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      photo: faker.image.avatar(),
    };
    output.push(user);
  }
  return res.json(output);
});
//------------------------------------------------------------------------------
//==============================================================================
/**
* Export router
*/
module.exports = router;
//------------------------------------------------------------------------------
