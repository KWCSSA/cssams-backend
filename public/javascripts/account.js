var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: String,
  password: String,
  email: {
    type: String,
    unique: true
  },
  fname: String,
  lname: String,
  idnum: Number,
  passwordResetToken: String,
  passwordResetExpires: Date
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);