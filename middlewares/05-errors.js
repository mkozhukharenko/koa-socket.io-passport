

module.exports = function*(next) {

  try {
    yield* next;
  } catch (e) {
    console.log(e);

    if (e.status) {
      // could use template methods to render error page
      this.body = e.message;
      this.statusCode = e.status;
    }  else if (e.name == 'ValidationError') {
      this.status = 400;

      var errors = {};

      for (var field in e.errors) {
        errors[field] = e.errors[field].message;
      }

      this.body = {
        errors: errors
      };

    } else {
      this.body = e;
      this.statusCode = 500;
      console.error(e.message, e.stack);
    }

  }
};
