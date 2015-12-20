'use strict';


module.exports.get = function* (next) {
	this.body = this.render('register');
};

/*/////////////////////////
 * Signup/Registration
 */////////////////////////
module.exports.post = function* (next) {
	var body = this.request.body;

	if (!body || !body.name || !body.email || !body.password) {
    this.throw("Missing username or email or password", 400);
  }

	const User = require('../models/user');
	var user;
	// case #1 - if user was registered by fb/google before - then just add a password;
	user = yield User.findOneAndUpdate( 
      { email: body.email }, { 
        $set: { 
          passpord: body.passpord
        }
      }, { 'new': true });

	// case #2 - user has never been registering before - then create new one;
	if (!user) {
		user = yield User.create(body);
	}
	yield this.login(user);
	console.log('user', user);
	this.body = { user: this.passport.user };
	
};