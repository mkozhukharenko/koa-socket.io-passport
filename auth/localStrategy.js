"use strict";

const co = require('co');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

// done(err) - ошибка
// done(null, user)
// done(null, false)  - юезр не найден
// done(null, null, { message: "Wops! Access denied! Wrong password!" })

module.exports = new LocalStrategy({
  	usernameField: 'email',
  	passwordField: 'password'
  },	function  (email, password, done) {
    class AuthError extends Error {};
    co(function*() {
      var user = yield User.findOne({
        email: email
      });
      if (!user) {
        return null;
      }
      if (!user.checkPassword(password)) {
        throw new AuthError("Wrong pass or email");
      }
      return user;

    })
    .then(user => done(null, user))
    .catch(err => err instanceof AuthError ? done(null, false, err) : done(err));
});



