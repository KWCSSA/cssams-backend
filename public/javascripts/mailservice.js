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
		    data+=chunk;
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
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
		});

		
	},


};

module.exports = mailService;
