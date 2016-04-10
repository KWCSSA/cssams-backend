var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../public/javascripts/account.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',function(req,res,next) {
	console.log("CALLED FUCK");

	res.json({fuck:"isFucked"});


});

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

    res.json({loginName:req.body.username});
});

module.exports = router;
