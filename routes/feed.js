var express = require('express');
var router = express.Router();
var logger = require('../backend/services/logger.js');
var Posting = require('../backend/models/posting.js');
var getRandomName = require('../backend/services/randomnames.js');

/* GET posting feed
Implementing the most basic kind of feed for now
*/

router.get('/', function(req, res, next) {
  var offset = parseInt(req.query.offset);
  var limit = parseInt(req.query.limit);
  var query = Posting.find({}).
  sort({createdAt: -1}).
  skip(offset).
  limit(limit).
  populate('user', 'anonName fname lname idnum').
  populate('likes','idnum').
  populate('replies.user', 'anonName fname lname idnum');

  query.exec(function(err, postings) {
    if (err) logger.log('error', err);
    res.json(postings);
  });
});

module.exports = router;
