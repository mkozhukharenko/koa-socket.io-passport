const mongoose = require('mongoose');
const config = require('config');
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
