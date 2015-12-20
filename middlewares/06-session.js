// ------------ session -----------------------
const session = require('koa-generic-session');
const sesstionStore = require('../libs/sessionStore');
const config = require('config');

module.exports = session({
  store: sesstionStore,
  key: config.key,
  cookie: config.cookie,
  prefix: config.sessprefix,
  rolling: true
});
