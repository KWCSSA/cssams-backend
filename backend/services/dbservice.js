var Account = require('../models/account.js');
var logger = require('./logger.js');

var DBService = {
  getUserByEmail: function(email, cb) {
    Account.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        logger.log('error',err);
        cb(err, null);
      } else cb(null, user);

    });
  },

  getLastNumber: function(cb) {
    Account.count({}, function(err, count) {
      if (err) {
        logger.log('error',err);
        cb(err, null);
      }
      else {
        console.log('number of students is ' + count);
        cb(null, count);
      }
    });
  },

  getNotifiableUsers: function(cb) {
    Account.find({
      deviceToken: {$exists:true}
    }, function(err, users) {
      if (err) {
        logger.log('error', err);
        cb(err, null);
      } else cb(null, users);
    });
  }
}

module.exports = DBService;