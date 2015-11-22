'use strict';
/**
* Passport_Test App server module
*/
//==============================================================================
/**
* Module dependencies
*/
var
  config = require('./config'),
  passport = require('passport');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Module variables
*/
var
  User = require('../models/user'),
  utilities = require('../models/utilities'),
  cr8NewUser = utilities.cr8NewUser,
  errHandler = utilities.errHandler,
  validationErr = utilities.validationErr,
  LocalStrategy   = require('passport-local').Strategy,
  FBStrategy = require('passport-facebook').Strategy,
  fbAppId = config.fb.appID,
  fbAppSecret = config.fb.appSecret,
  fbCallbackURL = config.fb.callbackURL,
  TwitterStrategy  = require('passport-twitter').Strategy,
  consumerKey = config.twitter.consumerKey,
  consumerSecret = config.twitter.consumerSecret,
  twitterCallbackURL = config.twitter.callbackURL;

//------------------------------------------------------------------------------
//==============================================================================/**
/**
* Configurations and settings
*/
//---------------------------Passport Session setup-----------------------------
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      console.error('There was an error accessing the records of' +
      ' user with id: ' + id);
      return console.log(err.message);
    }
    return done(null, user);
  })
});
//---------------------------Local Strategy-------------------------------------
//---------------------------local signup---------------------------------------
passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({'local.email': email}, function(err, user) {
        // if there are any errors, return the error
        if(err) {
          return errHandler(err);
          }
        // check to see if theres already a user with that email
        if(user) {
          console.log('user already exists');
          return done(null, false, {message: 'email already exists'});
        }
        else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            // save the user
            newUser.save(function(err) {
              if(err) {
                return errHandler(err);
                }
              console.log('New user successfully created...');
              console.log('email',email);
              console.log('newUser.local.email',newUser.local.email);
              console.log(newUser);
              return done(null, newUser);
            });
          }
      });
    });
}));
//---------------------------local login----------------------------------------
passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if(err) {
              return errHandler(err);
              }

            // if no user is found, return the message
            if(!user) {
              return done(null, false, {message: 'User does not exist'});
              } // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if(!user.validPassword(password)) {
              return done(null, false, {message: 'Invalid password'});
              } // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

}));
//---------------------------Facebook Strategy----------------------------------
passport.use(new FBStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: fbAppId,
        clientSecret: fbAppSecret,
        callbackURL: fbCallbackURL,
        profileFields: ['id', 'displayName', 'emails', 'photos']

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) {
                  console.error('There was an error accessing the dbase', err.message);
                  return done(err);
                  }

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.photo = profile.photos[0].value || '';
                    newUser.facebook.displayName  = profile.displayName;
                    newUser.facebook.email = profile.emails[0].value;

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err) {
                          return errHandler(err);
                        }
                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
//---------------------------Twitter Strategy-----------------------------------
passport.use(new TwitterStrategy({

        consumerKey: consumerKey,
        consumerSecret: consumerSecret,
        callbackURL: twitterCallbackURL,
        profileFields: ['id', 'displayName', 'photos']

    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err){
                  console.error('There was an error accessing the dbase', err.message);
                  return done(err);
                  }

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser = new User();
                    // set all of the user data that we need
                    newUser.twitter.id = profile.id;
                    newUser.twitter.photo = profile.photos[0].value || '';
                    newUser.twitter.displayName = profile.displayName;
                    // save our user into the database
                    newUser.save(function(err) {
                      if (err) {
                        return errHandler(err);
                      }
                      return done(null, newUser);
                    });
                }
            });

    });

  }));
//------------------------------------------------------------------------------
//==============================================================================
/**
* Export module
*/
module.exports = passport;
//------------------------------------------------------------------------------
//==============================================================================
