
module.exports = function*(next) {

  try {
    yield* next;
  } catch (e) {
    console.error(e.status, e.name, e.message);
    console.error(e.stack);

    if (e.status) {
      // could use template methods to render error page
      this.body = e.message;
      this.status = e.status;
    } else if (e.name == 'ValidationError') {
      this.status = 400;

      var errors = {};

      for (var field in e.errors) {
        errors[field] = e.errors[field].message;
      }

      this.body = {
        errors: errors
      };

    } else {
      this.status = 500;
      this.body = e;
    }

  }
};
