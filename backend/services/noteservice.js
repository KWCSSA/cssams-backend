var APNToken = require('../../secret.js').APNtoken;
var apn = require('apn');
var apnProvider = new apn.Provider(APNToken);
var ServerKey = require('../../secret.js').ServerKey;
var note = new apn.Notification();
var gcm = require('node-gcm');
var logger = require('./logger');  


var noteservice = {
	sendCommentNote: function(dToken, postingId, comment) {
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = "\u2709 You have a new comment! \"" + comment + "\"";
    note.payload = {
      'type': 'comment', 
      'postingId': postingId
    };
    note.topic = "com.diantang.cssams";
    apnProvider.send(note, dToken).then((result) => {
      logger.log("info", result);
      if (result.failed.length != 0) {
        apnProvider = new apn.Provider(APNToken);
        apnProvider.send(note, dToken).then((result) => {
          logger.log("info", result);
        });
      }
    });
	},

  sendLikeNote: function(dToken, postingId) {
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.sound = "ping.aiff";
    note.alert = "You have a new \u2764!";
    note.payload = {
      'type': 'comment', 
      'postingId': postingId
    };
    note.topic = "com.diantang.cssams";
    apnProvider.send(note, dToken).then((result) => {
      logger.log("info", result);
      if (result.failed.length != 0) {
        apnProvider = new apn.Provider(APNToken);
        apnProvider.send(note, dToken).then((result) => {
          logger.log("info", result);
        });
      }
    });
  },

  sendCommentNoteAndroid: function(dToken, postingId, comment) {
    var message = new gcm.Message({
    priority: 'high',
      data: {
          'type': 'comment',
          'postingId': postingId,
      },
      notification: {
          body: "\u2709 You have a new comment! \"" + comment + "\""
      }
    });

    var sender = new gcm.Sender(ServerKey);
    var registrationTokens = [];
    registrationTokens.push(dToken);

    sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
      if(err) console.log("error", err);
      else console.log("info", response);
    });
  },

  sendLikeNoteAndroid: function(dToken, postingId) {
    var message = new gcm.Message({
    priority: 'high',
      data: {
          'type': 'comment',
          'postingId': postingId,
      },
      notification: {
          body: "You have a new \u2764!"
      }
    });

    var sender = new gcm.Sender(ServerKey);
    var registrationTokens = [];
    registrationTokens.push(dToken);

    sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
      if(err) console.log("error", err);
      else console.log("info", response);
    });
  }
}


module.exports = noteservice;