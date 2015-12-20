'use strict';

var socket = require('../socket');
/**
 * [POST] /logout
 * excecute logout (passport do this )
 */
module.exports.post = function* (next) {

  if (this.session.socketIds) {
    this.session.socketIds.forEach(function(socketId) {
      console.log("emit to", socketId);
      socket.emitter.to(socketId).emit('logout');
    });
  }

	this.logout();
	this.status = 204;
};

