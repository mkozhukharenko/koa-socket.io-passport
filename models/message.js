'use strict';

const mongoose = require('../libs/mongoose');

var messageSchema = new mongoose.Schema({
	text: {
		type 				: String,
		required 		: true
	},
	user:   {
		id 					: {
			type 			: mongoose.Schema.Types.ObjectId,
			required	: true
		},
		name 				: String
	},
	created 			: {
		type 				: Date,
		default 		: Date.now
	}
});

module.exports = mongoose.model('Message', messageSchema);

