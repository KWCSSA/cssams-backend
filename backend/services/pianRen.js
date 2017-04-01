var mongoose = require('mongoose');
var DBService = require('./dbservice');
var noteservice = require('./noteservice');

//connect mongodb
mongoose.connect('mongodb://localhost/cssams');

DBService.getNotifiableUsers(function(err, users) {
  var ID = '58dfe47a657dd05c2b56df96';

  for (var i = 0; i < users.length; i++) {
    noteservice.sendCommentNote(users[i].deviceToken, ID, 'Hey ' + users[i].fname + ',' + '有句话我一直憋在心里不敢说，其实我喜欢你很久了...');
    noteservice.sendCommentNoteAndroid(users[i].deviceToken, ID, 'Hey ' + users[i].fname + ',' + '有句话我一直憋在心里不敢说，其实我喜欢你很久了...');
  }
});



