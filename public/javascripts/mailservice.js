var nodemailer = require('nodemailer');
var smtpConfig = require('../../secret.js').smtpConfig;
var fs = require('fs');
var ejs = require('ejs');
var transporter = nodemailer.createTransport(smtpConfig);


var mailService = {

  sendWelcomeEmail: function(user) {
    var htmlStream = fs.createReadStream('public/javascripts/welcome.html');
    var data = '';

    htmlStream.on('data', function(chunk) {
      data += chunk;
    });

    htmlStream.on('end', function() {
      console.log(data);
      var text = ejs.render(data, user);
      var subject = ejs.render('Hello <%= firstName %>, 欢迎加入KWCSSA!', user);

      var mailOptions = {
        from: '"Dian Tang" <it@uwcssa.com>', // sender address
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
    var text = 'Your user name for KWCSSA is  ' + user.username + '  You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
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
  }


};

module.exports = mailService;