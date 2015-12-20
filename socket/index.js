'use strict';

var socketIO = require('socket.io');

module.exports = function(server) {
	var io = socketIO(server);
	
	////////////////////
	//  --- auth  
	////////////////////
	io.use(require('./socketAuth'));

	////////////////////
	// --- chat
	////////////////////
	io.on('connection', require('./chat'));
	
	io.on('error', function(e) {
		console.log('socket error:', e);
	});

	io.set('origins', 'localhost:*');
};
