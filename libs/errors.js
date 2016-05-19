'use strict';

// custom error
function CustomError (status, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.status = status;
};

require('util').inherits(CustomError, Error);

// the same as above but with help of ES6 classes
class CustomErrorClass extends Error {
  constructor (status, message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
  }
}

module.exports = {
  CustomError,
  CustomErrorClass
};