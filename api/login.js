'use strict';

const User = require('../models/user');
// const passport = require('../index').passport;
const passport =  require('koa-passport');

/**
 * just render login page on req
 * [GET] /login 
 */
module.exports.get = function* (next) {
	this.body = this.render('login');
};

/*
	[POST] local sidgn in
 */
module.exports.post = function* (next) {
	var _this = this;
  yield* passport.authenticate('local', function*(err, user, info) {
  	try {
	    if (err) throw err;
	    if (user === false) {
	      _this.status = 401;
	    } else { 
	      yield _this.login(user);
	      _this.body = { user: user };
	    }
  	} catch (e) {
  		console.log(e);
  		throw e;
  	}

  }).call(this);
};

/*
	FACEBOOK CALL
 */
module.exports.facebook = function* (next) {
	yield* passport.authenticate('facebook', { 
		authType: 'rerequest',
		scope : ['public_profile', 'email']
	})
	.call(this);
};

/*
	FACEBOOK Callback
 */
module.exports.facebookCallback = function* (next) {
	yield* passport.authenticate('facebook',{
    successRedirect: '/main',
    failureRedirect: '/login'
	})
	.call(this);
};

/*
	GOOGLE CALL
 */
module.exports.google = function* (next) {
	yield* passport.authenticate('google', {scope: ['profile', 'email']})
	.call(this);
};

/*
	GOOGLE Callback
 */
module.exports.googleCallback = function* (next) {
	var _this = this;
	yield* passport.authenticate('google', function*(err, user, info) {
    if (err) throw err;
    if (user === false) {
      _this.status = 401;
    } else {
      yield _this.login(user);
      _this.redirect('/main');
      _this.body = { user: user };
      
    }
	})
	.call(this);
};