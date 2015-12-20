const mongoose = require('../libs/mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const util = require('util');
const config = require('config');

var userSchema = new mongoose.Schema({
	name: {
		type      : String,
		required	: "Имя пользователя отсутствует."
	},
	email:   {
		type      : String,
		unique    : true,
		validate  : [
		{
			validator: function(value) {
				return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
			},
			msg:       'Некорректный email.'
		}
		],
	},
	facebook			: {
		id  				: String,
		token 			: String,
		email				: String,
		name 				: String
	},
	google        : {
		id          : String,
		token       : String,
		email       : String,
		name        : String
	},
	passwordHash: {
		type        : String,
		required    : false
	},
	salt: {
		type        : String,
		required    : false
	},
	created: {
		type         : Date,
		default      : Date.now
	}
});

userSchema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
  .set(function(password) {

    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
      }
    }

    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length);
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function() {
    return this._plainPassword;
  });



userSchema.methods.checkPassword = function(password) {
  if (!password) return false; // empty password means no login by password
  if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

  return crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length) == this.passwordHash;
};

userSchema.plugin(uniqueValidator, { 
	message: 'Ошибка: {PATH} уже существует.' 
});

module.exports = mongoose.model('User', userSchema);

