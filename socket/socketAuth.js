'use strict';

const cookie = require("cookie");
const cookieParser = require('cookie-parser');
const config = require('config');
const sessionStore = require('../libs/sessionStore');
const co = require('co');
const thunkify = require('thunkify');
const User = require('../models/user');

module.exports = function(socket, next) {
	
	var cookies = cookie.parse( socket.handshake.headers.cookie || "");
  var sid = config.sessprefix  + cookies[config.key];


	co(function* () {

	  var session = yield sessionStore.get(sid, true);
	  
    if (!session) {
      throw new Error("No session");
    }

    if (!session.passport && !session.passport.user) {
      throw new Error("Anonymous session not allowed");
    }

    // if needed: check if the user is allowed to join
    socket.user = yield User.findById(session.passport.user).exec();

    // if needed later: refresh socket.session on events
    socket.session = session;

    session.socketIds = session.socketIds ? session.socketIds.concat(socket.id) : [socket.id];
    console.log('session.socketIds', session.socketIds);

		yield* sessionStore.set(sid, session);

    socket.on('disconnect', function() {
      co(function* clearSocketId() {
        var session = yield* sessionStore.get(sid, true);
        if (session) {
          session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
          yield* sessionStore.set(sid, session);
        }
      }).catch(function(err) {
        console.error("session clear error", err);
      });
    });


	}).then(function() {
      next();
    }).catch(function(err) {
      console.log(err);
      next(err);
    });
};