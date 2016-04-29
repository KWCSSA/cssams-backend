var Account = require('./account.js');


var DBService = {
	getUser: function(username,cb) {
		Account.findOne({username:username},function(err,user){
			if(err) {
				console.log(err);
				cb(err,null);
			}
			cb(null,user);

		});
	},

	getLastNumber: function(cb) {
		Account.count({},function(err,count) {
			if(err) {
				console.log(err);
				cb(err,null);
			}
			console.log('number of students is '+count);
			cb(null,count);
		});
	}
};



module.exports = DBService;