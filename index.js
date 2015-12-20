// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

var http = require('http');
var koa = require('koa');
var config = require('config');
var mongoose = require('./libs/mongoose');
var app = koa();

// ------------ keys -----------------------
app.keys = [config.key];

// --------------- middlewares -------------
var path = require('path');
var fs = require('fs');
var middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ----------- passport ------------------
var passport = require('koa-passport');
app.use(passport.initialize());
app.use(require('./auth'));
app.use(passport.session());

// --------------- router -----------------------
var router = require('./routes')(app, passport);

// --------------- socket -----------------------
var server =  http.createServer(app.callback());
var socket = require('./socket');

if (!module.parent) {
	server.listen(config.app.port);
	socket(server);

	console.log("Server started, listening on port: " + config.app.port);
} else {
	module.exports = app;
	module.exports.socket = socket;
}

