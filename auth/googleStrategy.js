"use strict";

const co = require('co');
const config = require('config');
const User = require('../models/user');
// const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports = new GoogleStrategy({
    clientID: config.googleAuth.consumerKey,
    clientSecret: config.googleAuth.consumerSecret,
    callbackURL: config.googleAuth.callbackURL,
    passReqToCallback : true,
    accessType: 'offline'
  }, function (req, token, refreshToken, profile, done) {
    console.log('refreshToken', refreshToken);
    co(function* () {
      try {
        var googleData = {
          id      : profile.id,
          token   : token,
          name    : profile.displayName,
          email   : profile.emails[0].value
        }

        // case #1 : if email alrseady exist (but user isn't logged) - update it with google data.
        var localUser = yield User.findOneAndUpdate( 
          { email: profile.emails[0].value }, { 
            $set: { 
              google: googleData
            }
          }, { 'new': true });

        if (localUser) {
          console.log('localUser exist', localUser.toObject());
          return localUser;
        }

        // case #2: if user exist and was logged with google before 
        var user = yield User.findOne({ 'google.id' : profile.id});
        if (user) return user;
        
        // case #3: if user doesn't exist
        return yield User.create({
          name      : profile.displayName,
          email     : profile.emails[0].value,
          google    : googleData
        })

        // case #4: if user already logged with another account
        // need to chect req.user
      
      } catch (e) {
        console.log(e);
        return null;
      }
    }).then(function(user) {
      if (!user) done(null);
      console.log('user:', user.toObject())
      done(null, newUser);
    });

});


