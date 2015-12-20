const MongoStore = require('koa-generic-session-mongo'); // or koa-session-mongoose
const config = require('config');

console.log('config.database', config.mongo.database);	
module.exports = new MongoStore({
	db: config.mongo.database,
	collection: 'sessions',
	expires: 3600 * 5
});
