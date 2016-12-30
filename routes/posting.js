var express = require('express');
var router = express.Router();
var logger = require('../backend/logger.js');

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
        req.decoded = decoded;
        next();
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

});

/* POST posting. 
body: {
	content: String,
}
*/
router.post('/', function(req, res, next) {
	
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


