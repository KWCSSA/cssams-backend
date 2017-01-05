var express = require('express');
var router = express.Router();
var Posting = require('../backend/models/posting.js');
var logger = require('../backend/services/logger.js');
var DBService = require('../backend/services/dbservice.js');
var jwt = require('jsonwebtoken');
var secret = require('../secret.js').jwtSecret;

/* Middleware here to authenticate and identify user */
router.use(function(req, res, next) {
  console.log("GETTING THROUGH MIDDLEWARE");
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
    user:req.user.idnum
  }).
  sort({createdAt: -1});

  query.exec(function(err, postings) {
    if (err) return logger.log('error', err);
    res.json(postings);
  });
});

/* POST posting. 
body: {
	content: String,
}
*/
router.post('/', function(req, res, next) {
  // Assume content is legal. Should do exception handling in the future.
  // Implement anonymous in the future.
  var posting = new Posting({
    user: req.user.idnum,
    content: req.body.content
  });
  posting.save(function (err, posting) {
    if (err) return logger.log('error', err);
    res.json({
      success: true
    });
  });
});

/* GET one posting. */
router.get('/:id', function(req, res, next) {
	
});

/* PUT one posting. 
body: {
	content: String,
}
*/
router.put('/:id', function(req, res, next) {
	
});

/* DELETE one posting. */
router.delete('/:id', function(req, res, next) {
	
});

/* POST a like. 
check whether the user has liked or not
*/
router.post('/like/:id', function(req, res, next) {
	
});

/* DELETE a like. */
router.delete('/like/:id', function(req, res, next) {
	
});

/* POST a reply. */
router.post('/reply/:id', function(req, res, next) {
	
});

/* DELETE a reply. */
router.delete('/reply/:id/:rid', function(req, res, next) {
	
});

module.exports = router;


