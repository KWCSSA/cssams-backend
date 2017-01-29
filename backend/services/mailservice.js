var nodemailer = require('nodemailer');
var smtpConfig = require('../../secret.js').smtpConfig;
var fs = require('fs');
var ejs = require('ejs');
var transporter = nodemailer.createTransport(smtpConfig);


var mailService = {

  sendWelcomeEmail: function(user) {
    var htmlStream = fs.createReadStream('backend/welcome.html');
    var data = '';

    htmlStream.on('data', function(chunk) {
      data += chunk;
    });

    htmlStream.on('end', function() {
      console.log(data);
      var text = ejs.render(data, user);
      var subject = ejs.render('Hello <%= firstName %>, 欢迎加入KWCSSA!', user);

      var mailOptions = {
        from: '"KWCSSA IT department" <it@uwcssa.com>', // sender address
        to: user.email, // list of receivers
        subject: subject,
        html: text
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
    });


  },

  sendResetPasswordEmail: function(user) {

    var subject = 'Please reset your password';
    var text = 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + user.host + '/reset/' + user.resetToken + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n';

    var mailOptions = {
      from: '"KWCSSA IT department" <it@uwcssa.com>', // sender address
      to: user.email, // list of receivers
      subject: subject,
      html: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  },

  sendConfirmationEmail: function(user) {

    var subject = 'Your password has been changed';
    var text = 'Hello,\n\n' +
      'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n';

    var mailOptions = {
      from: '"KWCSSA IT department" <it@uwcssa.com>', // sender address
      to: user.email, // list of receivers
      subject: subject,
      html: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  },

  sendEmailVerificationEmail: function(user) {

    var subject = 'Action required: Please verify your email address';
    var text = 'Hello, \n\n' +
      'This is a verification email. Please click the following link to verify your email address. \n\n' +
      'http://' + user.host + '/verify/' + user.verificationToken + '\n\n' +
      'Thank you very much.';

    var mailOptions = {
      from: '"KWCSSA IT department" <it@uwcssa.com>', // sender address
      to: user.email, // list of receivers
      subject: subject,
      html: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  },

  sendEmailVerificationAlreadyDoneEmail: function(user) {

    var subject = 'Your email has already been verified';
    var text = 'Hello, \n\n' +
      'Your email has already been verified. No action is required.';

    var mailOptions = {
      from: '"KWCSSA IT department" <it@uwcssa.com>', // sender address
      to: user.email, // list of receivers
      subject: subject,
      html: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  },


  sendEmailVerificationSuccessfulEmail: function(user) {

    var subject = 'Your email has been verified';
    var text = 'Hello, \n\n' +
      'Your email has been verified successfully. No further action is required.';

    var mailOptions = {
      from: '"KWCSSA IT department" <it@uwcssa.com>', // sender address
      to: user.email, // list of receivers
      subject: subject,
      html: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }


};

module.exports = mailService;
