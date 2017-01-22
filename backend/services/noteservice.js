var APNToken = require('./secret.js').APNtoken;
var apn = require('apn');
var apnProvider = new apn.Provider(APNToken);
var note = new apn.Notification();
var logger = require('./logger');  


var noteservice = {
	sendCommentNote: function(dToken, postingId) {
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "\uD83D\uDCE7 \u2709 You have a new comment!";
    note.payload = {
      'type': 'comment', 
      'postingId': postingId
    };
    note.topic = "com.diantang.cssams";
    apnProvider.send(note, dToken).then((result) => {
      // see documentation for an explanation of result
      logger.log("info", result);
    });
	}
}

module.exports = noteservice;