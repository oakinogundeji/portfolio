'use strict';
/**
* Kaizenify App Router module
*/
//==============================================================================
/**
* Module dependencies
*/
var
  passport = require('../config/passport'),
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
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}
//------------------------------------------------------------------------------
//==============================================================================
/**
* Middleware
*/
router.use(passport.initialize());
router.use(passport.session());
//------------------------------------------------------------------------------
/**
* Routes
*/
//---------------------------Test route-----------------------------------------
router.get('/test', function (req, res) {
  return res.send('<marquee><h1>Hellooooo World!</h1></marquee>');//sends html
  //to the browser for it to render
});
//---------------------------Root route-----------------------------------------
router.get('/', function (req, res) {
  return res.render('index');//uses view engine to render the page
});
//---------------------------Login route----------------------------------------
router.route('/login')
  .get(function (req, res) {
    return res.render('login');
  })
  .post(passport.authenticate('local-login', {
          successRedirect : '/kaizenify',
          failureRedirect : '/login',
          failureFlash : false
      }));
//---------------------------Signup route---------------------------------------
router.route('/signup')
  .get(function (req, res) {
    return res.render('signup');
  })
  .post(passport.authenticate('local-signup', {
          successRedirect : '/kaizenify',
          failureRedirect : '/signup',
          failureFlash : false
      }));
//---------------------------FB Routes------------------------------------------
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/kaizenify',
  failureRedirect: '/'
  })
);
//---------------------------Twitter Routes-------------------------------------
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
      successRedirect : '/kaizenify',
      failureRedirect : '/'
  })
);
//---------------------------Kaizenify Chatrooms route--------------------------
router.get('/kaizenify', isLoggedIn, function (req, res) {
  console.log('session user', req.user);
  var data = {
    localemail: req.user.local.email,
    fbEmail: req.user.facebook.email,
    fbPhoto: req.user.facebook.photo,
    fbDisplayName: req.user.facebook.displayName,
    twitterPhoto: req.user.twitter.photo,
    twitterDisplayName: req.user.twitter.displayName
  };
  return res.render('chatrooms', data);
});
//---------------------------Logout route---------------------------------------
router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
//------------------------------------------------------------------------------
//==============================================================================
/**
* Export router
*/
module.exports = router;
//------------------------------------------------------------------------------
