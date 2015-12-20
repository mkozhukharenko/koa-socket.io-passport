'use strict';
const Message = require('../models/message');


/**
 * just render chat page on req
 * [GET] /chat 
 */
module.exports.get = function* (next) {

	let allMessages = yield Message.find({}).lean();
	
	this.body = this.render('chat', {
		allmessages: allMessages,
		authorized: this.isAuthenticated()
	});	


};