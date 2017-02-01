var express = require('express');
var router = express.Router();
var Posting = require('../backend/models/posting.js');
var Account = require('../backend/models/account.js');
var logger = require('../backend/services/logger.js');
var DBService = require('../backend/services/dbservice.js');
var jwt = require('jsonwebtoken');
var secret = require('../secret.js').jwtSecret;
var noteservice = require('../backend/services/noteservice.js');
var getRandomName = require('../backend/services/randomnames.js');

/* Middleware here to authenticate and identify user */
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        DBService.getUserByEmail(decoded._doc.email, function(err, user) {
          if (err) return handleError(res, err);
          req.user = user;
          next();
        });
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});



/* GET self postings. */
router.get('/', function(req, res, next) {
  var query = Posting.find({
    user: req.user._id
  }).
  populate('user', 'fname lname idnum').
  populate('replies.user', 'fname lname idnum').
  sort({createdAt: -1});

  query.exec(function(err, postings) {
    if (err) {
      logger.log('error', err);
    } else {
      postings.forEach(function(post) {
        if (post.isAnon == true) {
          post.user = null;
          post.replies.forEach(function(reply) {
            if (reply.isAnon == true) {
              reply.user = null;
            }
          });
        }
      });
      res.json(postings);
    }
  }
);
});

/* POST posting.
body: {
	content: String,
}
*/
router.post('/', function(req, res, next) {
  // Assume content is legal. Should do exception handling in the future.
  if (!req.user.isEmailVerified) {
    return res.json({
      success: false,
      msg: '需要验证邮箱才能贴条。在\"我\"页面可以找到发送验证邮件按钮。'
    });
  }
  var randName = getRandomName();
  var display = req.body.isAnon ? randName : undefined;
  var posting = new Posting({
    user: req.user._id,
    content: req.body.content,
    isAnon: req.body.isAnon,
    anonName: display,
    score: 168
  });
  posting.save(function (err, posting) {
    if (err) return handleError(res, err);
    console.log(posting);
    res.json({
      success: true
    });
  });
});

/* GET one posting. */
router.get('/:id', function(req, res, next) {
  var query = Posting.findOne({_id:req.params.id}).
  populate('user', 'fname lname idnum').
  populate('replies.user', 'fname lname idnum');

  query.exec(function(err, posting) {
    if (err) {
      return handleError(res, err);
    } else {
      if (posting.isAnon == true) {
        posting.user = null;
        posting.replies.forEach(function(reply) {
          if (reply.isAnon == true) {
            reply.user = null;
          }
        });
      }
      res.json(posting);
    }
  });
});

/* PUT one posting.
body: {
	content: String,
}
*/
/* This action may cause confusion to others, disable for now
router.put('/:id', function(req, res, next) {
	Posting.update({_id:req.params.id}, {
    content: req.body.content
  },function (err) {
     if (err) return handleError(res, err);
     res.json({
       success:true
     });
    }
  );
});
*/

/* DELETE one posting. */
router.delete('/:id', function(req, res, next) {
	Posting.remove({_id: req.params.id}, function(err) {
    if (err) return handleError(res, err);
    res.json({
      success: true
    });
  });
});

/* POST a like.
check whether the user has liked or not
*/
router.post('/:id/like', function(req, res, next) {
	Posting.findOne({_id: req.params.id}, function(err, posting) {
    if (err) return handleError(res, err);
    if (posting.likes.indexOf(req.user._id) != -1) {
      res.status(400).send({
        success: false,
        msg: "ERROR User " + req.user.idnum + " has already liked this posting."
      });
    } else {
      posting.likes.push(req.user._id);
      posting.score = posting.score + 30;
      posting.save(function(err, posting) {
        if(err) return handleError(res, err);

        res.json({
          success: true
        });
      });
    }
  });
});

/* DELETE a like. */
router.delete('/:id/like', function(req, res, next) {
  Posting.findOne({_id: req.params.id}, function(err, posting) {
    if (err) return handleError(res, err);
    var index = posting.likes.indexOf(req.user._id);
    if (index == -1) {
      res.status(400).send({
        success: false,
        msg: "ERROR User " + req.user.idnum + " has never ever liked this posting."
      });
    } else {
      posting.likes.splice(index, 1);
      posting.score = posting.score - 30;
      posting.save(function(err, posting) {
        if(err) return handleError(res, err);
        res.json({
          success: true
        });
      });
    }
  });
});

/* POST a reply. */
router.post('/:id/reply', function(req, res, next) {
  if (!req.user.isEmailVerified) {
    return res.json({
      success: false,
      msg: '需要验证邮箱才能发评论。在\"我\"页面可以找到发送验证邮件按钮。'
    });
  }
	Posting.findOne({_id: req.params.id}, function(err, posting) {
    if (err) return handleError(res, err);
    var rid;
    //assign rid to the last reply's id + 1
    if (posting.replies.length == 0) rid = 0;
    else rid = posting.replies[posting.replies.length-1].rid + 1;

    var randName = getRandomName();
    var display = req.body.isAnon ? randName : undefined;

    var reply = {
      user: req.user._id,
      content: req.body.content,
      isAnon: req.body.isAnon,
      anonName: display,
      rid: rid
    }
    posting.replies.push(reply);
    posting.score = posting.score + 50;
    posting.save(function(err, posting) {
      if (err) return handleError(res, err);

      Account.findOne({_id: posting.user}, function(err, user) {
        if (user.deviceToken && req.user._id.toString() != posting.user.toString()) {
          noteservice.sendCommentNote(user.deviceToken, posting._id, req.body.content);
        }
      });
      
      res.json({
        success: true
      });
    });
  });
});

/* DELETE a reply. */
router.delete('/:id/reply/:rid', function(req, res, next) {
	Posting.findOne({_id: req.params.id}, function(err, posting) {
    if (err) return handleError(res, err);
    // This can be optimized to O(log(n)), maybe after taking CS240
    var rid = req.params.rid;
    var counter = rid;
    var notFound = false;
    while (posting.replies[counter] == null || posting.replies[counter].rid > rid) {
      counter--;
      if (counter == -1 || (posting.replies[counter] != null && posting.replies[counter].rid < rid)) {
        notFound = true;
        break;
      }
    }
    if (!notFound) {
      if (posting.replies[counter].user != req.user._id) {
        return res.status(403).send({
          success: false,
          msg: "Not authorized to do so"
        });
      }
      posting.replies.splice(counter, 1);
      posting.score = posting.score - 50;
      posting.save(function(err, posting) {
        if(err) return handleError(res, err);
        res.json({
          success: true
        });
      });
    } else {
      res.status(400).send({
        success: false,
        msg: "reply not found"
      });
    }
  });
});

function handleError(res, err) {
  logger.log('error', err);
  res.status(400).send({
    success: false,
    msg: err
  })
}

module.exports = router;
