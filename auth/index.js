"use strict";

const passport = require('koa-passport');
const config = require('config');
const User = require('../models/user');

function serialize (user, done) {
	// console.log('user before serialize:', user);
  done(null, user._id);
};

function  deserialize (id, done) {
  User.findById(id, done);
};

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

passport.use(require('./localStrategy'));
passport.use(require('./facebookStrategy'));
passport.use(require('./googleStrategy'));




module.exports = passport.initialize();
