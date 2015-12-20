'use strict';

var http = require('http');
var config = require('config');
var app = require('../index');
var server;

module.exports.boot = function () {
	server = http.createServer(app.callback());
	server.listen(config.app.port);
	console.log("Server started, listening on port: " + config.app.port);
};

module.exports.close = function () {
	server.close();
	require('../libs/mongoose').disconnect();
	console.log('closing server and all cnnecitons');
};
