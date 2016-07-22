var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../public/javascripts/account.js');
var CardCreater = require('../public/javascripts/createCard.js');
var DBService = require('../public/javascripts/dbservice.js');
var jwt    = require('jsonwebtoken');
var secret = require('../secret.js').jwtSecret;
var bosses = require('../public/javascripts/shopdata.js');
var mailService = require('../public/javascripts/mailservice.js');
var app = express();

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding);
}

router.post('/register',function(req,res,next) {
	console.log('registering user');
  var user_regdate = new Date(Date.now()).toISOString();
  var register_year = user_regdate.substring(0,4);
  //should define user_memid later!
  
  DBService.getLastNumber(function(err,count) {
    if (err) console.log(err);
    var user_idnum = count + 1 + 1000;
    var user_memid_padding = register_year + pad(8,user_idnum,'0');
     Account.register(new Account({username: req.body.username,
      fname:req.body.fname,
      lname:req.body.lname,
      email:req.body .email,
      regdate:user_regdate,
      idnum:user_memid_padding}), req.body.password, function(err) {
      if (err) {
        console.log('error while user register!', err);
        res.json({success:false,Message:err});
        //return next(err);
      }
      else {
        res.json({success:true});
        console.log('user registered!');
        mailService.sendWelcomeEmail({
          firstName:req.body.fname,
          email:req.body.email,
          username:req.body.username,
          password:req.body.password});
      }
      
  });
});
});


router.post('/login', passport.authenticate('local', { session: false }),function(req, res) {
      console.log('user logon!');
      console.log(req.user);

        var token = jwt.sign(req.user, secret, {
          expiresIn: '365d' // expires in 24 hours
        });
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });


});

router.get('/bosses', function (req,res,next) {
  res.json(bosses);
});



router.use(function(req, res, next) {
console.log("GETTING THROUGH MIDDLEWARE");
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
       // console.log(JSON.stringify(decoded));
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



router.get('/cardimage',function(req,res,next){

  console.log("gettingImage!");
  DBService.getUser(req.decoded._doc.username,function(err,user) {
    if (err) console.log(err);
    console.log(JSON.stringify(user));
    CardCreater.createCard(user.fname,user.lname,user.idnum, function(err,data) {
      if (err) console.log(err);
        else {
          console.log (data);
          res.json({imageURL:data.imageURL,imageName:data.imageName});
        }

    });
   
  });

});

router.get('/profile',function(req,res,next){

  console.log("gettingProfile!");
  DBService.getUser(req.decoded._doc.username,function(err,user) {
    if (err) console.log(err);
    console.log(JSON.stringify(user));
    res.json(user);
   
  });

});




module.exports = router;
