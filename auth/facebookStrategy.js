"use strict";

const co = require('co');
const config = require('config');
const User = require('../models/user');
// const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;


module.exports = new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'email'],
    enableProof: false,
    passReqToCallback : true
  }, function (req, token, tokenSecret, profile, done) {
    console.log('req', req)
    console.log('token, tokenSecret, profile', token, tokenSecret, profile);
     
     co(function* () {
      try {
        var facebookData = {
          id      : profile.id,
          token   : token,
          name    : profile.displayName,
          email   : profile.emails[0].value
        }
        // case #1 : if email already exist (but user isn't logged) - update it with google data.
        var localUser = yield User.findOneAndUpdate( 
          { email: profile.emails[0].value }, { 
            $set: { 
              facebook: facebookData
            }
          }, { 'new': true });

        // case #2: if user exist and was logged with google before 
        var user = yield User.findOne({ 'facebook.id' : profile.id});
        if (user) return user;
        
        // case #3: if user doesn't exist
        return yield User.create({
          name      : profile.displayName,
          email     : profile.emails[0].value,
          facebook  : facebookData
        })

        // case #4: if user already logged with another account
        // need to chect req.user
      
      } catch (e) {
        console.log(e);
        return null;
      }
    }).then(function(newUser) {
      console.log('user:', newUser.toObject())
      done(null, newUser);
    });
});

