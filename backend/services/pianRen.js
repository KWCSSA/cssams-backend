var DBService = require('./dbservice.js');
var noteservice = require('./noteservice.js');

DBService.getNotifiableUsers(function(err, users) {
	console.log(users);
});

