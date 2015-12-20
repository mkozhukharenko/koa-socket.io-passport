/**
 * This file must be required at least ONCE.
 * After it's done, one can use require('mongoose')
 *
 * In web-app: this is done at init phase
 * In tests: in mocha.opts
 * In gulpfile: in beginning
 */


const mongoose = require('mongoose');
const config = require('config');

if (process.env.MONGOOSE_DEBUG) {
  mongoose.set('debug', true);
}
/**
 * Connect to the database on localhost with
 * the default port (27017)
 */
mongoose.connect('mongodb://localhost/' + config.mongo.database, {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});


mongoose.connection.on('error', function (err) {
 	console.log('connection error:', err);
});
mongoose.connection.on('open', function (ref) {
  console.log('Connected to Mongo server...');
});
mongoose.connection.on('close', function (ref) {
  console.log('Closing Mongo server...');
});

module.exports = mongoose;
