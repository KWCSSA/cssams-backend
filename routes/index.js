var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var Account = require('../backend/models/account.js');
var CardCreater = require('../backend/services/createCard.js');
var DBService = require('../backend/services/dbservice.js');
var jwt = require('jsonwebtoken');
var secret = require('../secret.js').jwtSecret;
var bosses = require('../backend/shopdata.js');
var mailService = require('../backend/services/mailservice.js');
var logger = require('../backend/services/logger.js');
var app = express();

function pad(width, string, padding) {
  return (width <= string.length) ? string : pad(width, padding + string, padding);
}

router.post('/register', function(req, res, next) {
  console.log('registering user');
  var user_regdate = new Date(Date.now()).toISOString();
  var register_year = user_regdate.substring(0, 4);
  //should define user_memid later!

  DBService.getLastNumber(function(err, count) {
    if (err) return logger.log('error', err);
    var user_idnum = count + 1 + 1000;
    var user_memid_padding = register_year + pad(8, user_idnum, '0');
    Account.register(new Account({
      username: req.body.username,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      idnum: user_memid_padding
    }), req.body.password, function(err) {
      if (err) {
        logger.log('error', 'error while user register!', err);
        res.json({
          success: false,
          Message: err
        });
        //return next(err);
      } else {
        res.json({
          success: true
        });
        console.log('info','user registered!');
        mailService.sendWelcomeEmail({
          firstName: req.body.fname,
          email: req.body.email
        });
      }
    });
  });
});

router.post('/login', isEmailOrUsername, passport.authenticate('local', {
  session: false
}), function(req, res) {
  logger.log('info',req.user.email+" logon!");

  var token = jwt.sign(req.user, secret, {
    expiresIn: '365d' // expires in 365 days
  });
  req.user.deviceToken = req.body.dToken;
  req.user.save(function (err, user) {
      if (err) return handleError(res, err);
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        _id: req.user._id
      });
    });
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Account.findOne({
        email: req.body.email
      }, function(err, user) {
        if (!user) {
          return res.status(400).send({
            msg: 'The email address ' + req.body.email + ' is not associated with any account.'
          });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      res.json({
        success: true
      });
      console.log('user forgot password!');
      mailService.sendResetPasswordEmail({
        email: user.email,
        username: user.username,
        resetToken: token,
        host: req.headers.host
      });
      done();
    }
  ]);
});

router.post('/reset/:token', function(req, res, next) {
  Account.findOne({
      passwordResetToken: req.params.token
    })
    .where('passwordResetExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        return res.status(400).send({
          msg: 'Password reset token is invalid or has expired.'
        });
      }
      user.setPassword(req.body.password, function() {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            res.render('goodReset');
            console.log('user reset password!');
            mailService.sendConfirmationEmail({
              email: user.email
            });
          }
        });
      });
    });
});

router.get('/reset/:token', function(req, res, next) {
  Account.findOne({
    passwordResetToken: req.params.token
  }, function(err, user) {
    if (!user) res.render('badToken');
    else {
      res.render('reset', {
        user: user
      });
    }
  });
});

router.post('/verifyemail', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Account.findOne({
        email: req.body.email
      }, function(err, user) {
        if (!user) {
          return res.status(400).send({
            msg: 'The email address ' + req.body.email + ' is not associated with any account.'
          });
        }
        if(user.isEmailVerified) {
          done(undefined, undefined, user);
        } else {
          user.emailVerificationToken = token;
          user.emailVerificationExpires = Date.now() + 18000000; // expire in 5 hour
          user.save(function(err) {
            done(err, token, user);
          });
        }
      });
    },
    function(token, user, done) {
      res.json({
        success: true
      });

      if(typeof token != 'undefined') {
        mailService.sendEmailVerificationEmail({
          email: user.email,
          username: user.username,
          verificationToken: token,
          host: req.headers.host
        });
      } else {
        mailService.sendEmailVerificationAlreadyDoneEmail({
          email: user.email,
          username: user.username,
          host: req.headers.host
        });
      }
      done();
    }
  ]);
});

router.get('/verify/:token', function(req, res, next) {
  Account.findOne({
      emailVerificationToken: req.params.token
    })
    .where('emailVerificationExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        res.render('badToken');
      } else {

        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        user.isEmailVerified = true;

        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            res.render('verified');
            mailService.sendEmailVerificationSuccessfulEmail({
              email: user.email
            });
          }
        });
      }
    });
});

router.get('/bosses', function(req, res, next) {
  res.json(bosses);
});


router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.status(403).send({
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



router.get('/cardimage', function(req, res, next) {
  var user = req.user;
  logger.log('info', user.idnum + " getting Image!");
  CardCreater.createCard(user.fname, user.lname, user.idnum, function(err, data) {
    if (err) console.log(err);
    else {
      console.log(data);
      res.json({
        imageURL: data.imageURL,
        imageName: data.imageName
      });
    }
  });
});

router.get('/profile', function(req, res, next) {
  var user = req.user;
  res.json(user);
});

function isEmailOrUsername(req, res, next) {
  if (req.body.email) return next();
  Account.findOne({username: req.body.username}, function(err, user){
    if (err) {
      console.log(err);
      return err;
    }
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'No user associated with this username/email.'
      });
    }
    req.body.email = user.email;
    return next();
  });
}

function handleError(res, err) {
  logger.log('error', err);
  res.status(400).send({
    success: false,
    msg: err
  })
}


module.exports = router;
