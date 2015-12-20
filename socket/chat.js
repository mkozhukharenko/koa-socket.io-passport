'use strict';

const Message = require('../models/message');
const co = require('co');

module.exports = function (socket) {
	console.log('---- connections to socket ', socket.user);	

	var userName = (socket.user.name === '') ? 'No name' : socket.user.name;
	socket.broadcast.emit('join', userName);

	socket.on('message', function (data, cb) {

		co(function* () {
			let message = yield Message.create({
				text: data,
				user: {
					id: socket.user._id,
					name: userName
				}
			});
			console.log(message.toObject());

			socket.broadcast.emit('message', message.toObject());
			cb && cb();
		}).catch(err => console.log(err));

	});

	socket.on('typing', function() {
		socket.broadcast.emit('typing', userName);
	});
	socket.on('stop typing', function() {
		socket.broadcast.emit('stop typing', userName);
	});
	
	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.handshake.user);
	});

	return socket;
};