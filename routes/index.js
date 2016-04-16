var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../public/javascripts/account.js');
// var gd = require('node-gd');
var jwt    = require('jsonwebtoken');
var app = express();
//define constant values
var card_width = 400;
var card_height = 250;
var name_height_offset = 15; // same as font-size
var card_height_offset = 24;



// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/register',function(req,res,next) {
	console.log('registering user');
	  Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
	    if (err) {
	      console.log('error while user register!', err);
	      return next(err);
	    }

	    console.log('user registered!');

	   res.json({loginName:req.body.username});
});
});


router.post('/login', passport.authenticate('local', { session: false }),function(req, res) {
      console.log('user logon!');
      console.log(req.user);

        var token = jwt.sign(req.user, "iLoveDian", {
          expiresIn: 3600 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });


});




router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        console.log(decoded);
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


router.get('/cardImage',function(req,res,next){
	console.log("gettingImage!");

});





module.exports = router;
