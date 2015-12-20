'use strict';

const User = require('../models/user');
// const cookie = require("cookie");
// const config = require('config');
// const io = require('../socket');

/**
 * [POST] /logout
 * excecute logout (passport don this )
 */
module.exports.post = function* (next) {
	this.logout();
	// let sid = this.cookies.get(config.key);
	this.session = null;
	this.status = 204;
};

