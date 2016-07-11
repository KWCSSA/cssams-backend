var nodemailer = require('nodemailer');
var smtpConfig = require('./secret.js').smtpConfig;


var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols


// send mail with defined transport object

var mailService = {
	sendWelcomeEmail: function(name, email, username, password) {
		var mailOptions = {
		    from: '"Dian Tang" <it@uwcssa.com>', // sender address
		    to: email, // list of receivers
		    subject: 'Hello' + name + ', 欢迎加入UWCSSA！', // Subject line
		    text: 'Hello' + name + '欢迎加入UWCSSA!' + '你的账户信息为:'+ 'username: ' + username + '\r password' + password,
		    html: '<b>'+'Hello ' + name +'<br>'+ '欢迎加入UWCSSA!' + '你的账户信息为:'+ 'username: '+ username + '<br>'+' password' + password + '</b>'
		};
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
	},


};

module.exports = mailService;
