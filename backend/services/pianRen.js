var mongoose = require('mongoose');
var DBService = require('./dbservice');
var noteservice = require('./noteservice');

//connect mongodb
mongoose.connect('mongodb://localhost/cssams');

DBService.getNotifiableUsers(function(err, users) {
  console.log(users.length);
  var tester = users.filter(function(user) {
    return user.fname == 'Dian';
  });
  var ID = '58dfe47a657dd05c2b56df96';
  console.log(tester[0].deviceToken);
  noteservice.sendCommentNote(tester[0].deviceToken, ID, 'Hey ' + tester[0].fname + ',' + '我喜欢你很久了...');
  // noteservice.sendCommentNoteAndroid(user.deviceToken, posting._id, req.body.content);
  // for (var i = 0; i < users.length; i++) {
  //   console.log(users[i].deviceToken);
  // }
});



