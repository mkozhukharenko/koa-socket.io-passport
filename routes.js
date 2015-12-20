
var Router = require('koa-router');

// Редирект не работает!

var secured = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
  	this.redirect('/not-auth'); 
  	this.body = this.renderFile('./templates/notAuth.jade');
  	// this.status = 401;
  }
};

module.exports = function (app, passport) {
	var router = new Router();
	
	router.get('/login', require('./api/login').get);
  router.post('/login', require('./api/login').post);
	router.post('/logout', require('./api/logout').post);
	router.get('/register', require('./api/register').get);
	router.post('/register', require('./api/register').post);
	router.get('/not-auth', function* (next) {
		this.body = this.renderFile('./templates/notAuth.jade');
	});

	router.get('/auth/facebook', require('./api/login').facebook);
	router.get('/auth/facebook/callback', require('./api/login').facebookCallback);
	
	router.get('/auth/google', require('./api/login').google);
	router.get('/auth/google/callback', require('./api/login').googleCallback);

	// secured routes 
	router.get('/main', secured, require('./api/main'));
	router.get('/chat', secured, require('./api/chat').get);

	router.get('/', function*() {
		this.redirect('/main');
	});

	app
	  .use(router.routes())
	  .use(router.allowedMethods());
}