'use strict';

const User = require('../models/user');

module.exports = function* (next) {
  var count = this.session.count || 0;
  this.session.count = ++count;

	// console.log('passport user:: ', this.passport.user);

	let users = yield User.find({}).lean();

	let html =  this.render('index', {
    allusers: users,
    authorized: this.isAuthenticated(),
    count: count
  });

	this.body = html;
};


