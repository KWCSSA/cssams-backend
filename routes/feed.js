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
  populate('user', 'fname lname idnum').
  populate('likes', 'idnum').
  populate('replies.user', 'fname lname idnum');


  query.exec(function(err, postings) {
    if (err) {
      logger.log('error', err);
    } else {
<<<<<<< HEAD
      postings.forEach(function(post) {
        if (post.isAnon == true) {
          post.user = null;
          post.replies.forEach(function(reply) {
            if (reply.isAnon == true) {
=======
      postings.forEach(function(post){
        if(post.isAnon == true){
          post.user = null;
          post.replies.forEach(function(reply) {
            if(reply.isAnon == true){
>>>>>>> d16c47971862da20f559c561ef82a2e8f29b895d
              reply.user = null;
            }
          });
        }
      });
      res.json(postings);
    }
  });
});

module.exports = router;
