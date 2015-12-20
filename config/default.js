
const _ = require("lodash");
var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";
var defer = require('config/defer').deferConfig;
var path = require('path');

var base = {
  root: process.cwd(),
  env: env,
  sessprefix: 'koa:sess:',
  key: 'mysecret',

  cookie: {
      path: "/",
      httpOnly: true,
      overwrite: true,
      maxAge: 3600 * 5 * 100
    },
  crypto: {
    hash: {
      length:     128,
      iterations: process.env.NODE_ENV == 'production' ? 100 : 10
    }
  },
  template: {
    // template.root uses config.root
    // /Users/nikolay/Projects/koa-socketIO-passport/templates
    root: defer(function(cfg) {
      return path.join(cfg.root, 'templates');
    })
  },

  facebookAuth: {
    clientID: '460134064170971',
    clientSecret: 'b5789dd69b726da7221dd7321c3c7165',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  googleAuth: {
    consumerKey: '173334550897-ntb0bqu7c423aatj300eegbts3514ksl.apps.googleusercontent.com',
    consumerSecret: 'aZFisVwR-7JolnCJjvGUGoHT',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }
};

// development && test
var specific = {
  development: {
    app: {
      host: 'localhost',
      port: 3000,
      name: "Koa chat socketio - Dev",
      secret: 'mysecret',
    },
    mongo: {
      url: "mongodb://localhost/users",
      database: "users"
    },
  },
  test: {
    app: {
      host: 'localhost',
      port: 3001,
      name: "Koa chat socketio - Test",
      secret: 'mysecret',
    },
    mongo: {
      url: "mongodb://localhost/userstest",
      database: "userstest"
    },
  }
};

module.exports = _.merge(base, specific[env]);


