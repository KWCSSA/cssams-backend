var Account = require('./account.js');


var DBService = {
  getUserByEmail: function(email, cb) {
    Account.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        console.log(err);
        cb(err, null);
      } else cb(null, user);

    });
  },

  getLastNumber: function(cb) {
    Account.count({}, function(err, count) {
      if (err) {
        console.log(err);
        cb(err, null);
      }
      console.log('number of students is ' + count);
      cb(null, count);
    });
  },
};



module.exports = DBService;