'use strict';

const User = require('../models/user');
const util = require('util');
const CustomError = require('../libs/errors').CustomError;
const CustomErrorClass = require('../libs/errors').CustomErrorClass;

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
  throw new CustomError(405, 'CustomError msg');
  // throw new CustomErrorClass(406, 'CustomErrorClass msg');

	this.body = html;
};


