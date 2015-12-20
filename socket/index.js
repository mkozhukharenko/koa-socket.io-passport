'use strict';

var socketIO = require('socket.io');
// var socketEmitter = require('socket.io-emitter');
var socketEmitter = require('socket.io-mongodb-emitter');
var socketMongo = require('socket.io-adapter-mongo');

function socket (server) {
	var io = socketIO(server);
	
	io.adapter(socketMongo({ host: 'localhost', port: 27017 }));
	
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

socket.emitter = socketEmitter({ host: 'localhost', port: 27017 });
module.exports = socket;
