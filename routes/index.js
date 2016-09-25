var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
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

router.post('/forgot', function (req,res,next){
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      DBService.getInfo({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      res.json({success:true});
      console.log('user forgot password!');
      mailService.sendResetPasswordEmail({email:user.email, resetToken:token});
      done();
    }
  ]);
});

router.post('/reset/:token', function (req,res,next){
   Account.findOne({ passwordResetToken: req.params.token })
     .where('passwordResetExpires').gt(Date.now())
     .exec(function(err, user) {
       if (!user) {
         return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
       }
       user.setPassword(req.body.password, function(){
         user.passwordResetToken = undefined;
         user.passwordResetExpires = undefined;
         user.save(function(err){
           if(err){
             console.log(err);
           }else{
             res.json({success:true});
             console.log('user reset password!');
             mailService.sendConfirmationEmail({email:user.email});
           }
         });
       });
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
