var mongoose = require('mongoose');
var DBService = require('./dbservice.js');

//connect mongodb
mongoose.connect('mongodb://localhost/cssams');

DBService.getNotifiableUsers(function(err, users) {
  console.log(users);
});



