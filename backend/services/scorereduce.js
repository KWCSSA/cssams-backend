var schedule = require('node-schedule');
var Posting = require('../models/posting.js');

var rule = new schedule.RecurrenceRule();
rule.minute = 35;

var job = schedule.scheduleJob(rule, function() {
  Posting.update({}, {
    $inc: { score: -1 }
  }, { multi: true }, function(err) {
    if (err) console.log(err);
    console.log('score decreased');
  });
});

module.exports = job;
