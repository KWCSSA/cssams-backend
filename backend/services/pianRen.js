var mongoose = require('mongoose');
var DBService = require('./dbservice');
var noteservice = require('./noteservice');

//connect mongodb
mongoose.connect('mongodb://localhost/cssams');

DBService.getNotifiableUsers(function(err, users) {
  console.log(users.length);
  var tester = users.filter(function(user) {
    return user.fname == 'isa';
  })
  console.log (tester);
  // noteservice.sendCommentNote(user.deviceToken, posting._id, req.body.content);
  // noteservice.sendCommentNoteAndroid(user.deviceToken, posting._id, req.body.content);
  // for (var i = 0; i < users.length; i++) {
  //   console.log(users[i].deviceToken);
  // }
});



