'use strict';
process.env.NODE_ENV = 'test'

var request = require('co-request');
var mocha = require('co-mocha');
var should = require('should');
var app = require('../index');
var User = require('../models/user');

process.env.NODE_ENV = 'test';

function getURL(url) {
    return `http://localhost:3000${url}`;
}

describe('tests for whole app', function() {

  before(function*() {
    // yield* db.loadModels(fixtures);
    app.boot();
  });

  after(function* () {
    app.close();
  });


  /*///////////////
  * model unit tests
  *////////////////
  describe('user model tests', function() {

    it("should throw validation error then trying to save not valid emil", function*() {
      var user = {
        name: 'vasuya',
        email: 'BAD EMAIL'
      }
      try {
        user = yield User.create(user)
      } catch (err) {
        err.name.should.equal('ValidationError');
        err.errors.email.value.should.equal(user.email);
      }
    });

    it('dont allow to save duplicated emails', function* () {
      var user = {
        name: 'vasuya',
        email: 'vasuya@gmail.com'
      }
      // yield User.create(user)
      try {
        yield User.create(user)
      } catch (err) {
        err.name.should.equal('ValidationError');
      }
    })

  })

  /*///////////////
  * login test
  *////////////////
  describe('server login test', function() {

    it('shoud respond with erro - password is missing', function* () {

      var loginData = {
        email: 'vasya@gmail.com'
      }
      let response = yield request({
          method: 'post',
          url: getURL('/login'),
          form: JSON.stringify(loginDatgula)
      });
      console.log(response.statusCode);
      response.statusCode.should.eql(200);
    });

  })


})