var jade = require('jade');
var config = require('config');
var path = require('path');

module.exports = function* (next) {
	var ctx = this;

  /**
   * return user and flash message from a context
   * we can't just assign because user will be deserialized by passport later
   */
  this.locals = {
    get user() {
      return ctx.req.user; // passport sets this
    },

    get flash() {
      return ctx.flash;
    }
  };

  /**
   * [render description]
   * @param  {[string]} templatePath  [e.g. 'index']
   * @param  {[obj} data [{data: 'some data'}]
   * @return {[fn]}                   
   */
  this.render = function(templatePath, data) {
    data = data || {};

    var localsFull = Object.assign(Object.create(this.locals), data);

    var templatePathResolved = path.join(config.template.root, templatePath + '.jade');

    return jade.renderFile(templatePathResolved, localsFull);
  };

	yield* next;
};
