var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var user = require('./routes/user');
var posting = require('./routes/posting');
var feed = require('./routes/feed');
var jwt    = require('jsonwebtoken');
var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//passport middleware
app.use(passport.initialize());
// requires the model with Passport-Local Mongoose plugged in
var Account = require('./backend/models/account');

// use static authenticate method of model in LocalStrategy
passport.use(Account.createStrategy());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


//connect mongodb
mongoose.connect('mongodb://localhost/cssams', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});


//register routes
app.use('/', routes);
app.use('/user', user);
app.use('/posting', posting);
app.use('/feed', feed);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// var apn = require('apn');

// // Set up apn with the APNs Auth Key
// var apnProvider = new apn.Provider({  
//      token: {
//         key: 'APNs.p8', // Path to the key p8 file
//         keyId: '5345BYN944', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
//         teamId: 'NTNXPCWGW7', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
//     },
//     production: false // Set to true if sending a notification to a production iOS app
// });

// // Enter the device token from the Xcode console
// var deviceToken = '066efdf1f585cc099019d0364f435129254d3b8d69f3910cdd4443714374f0a8';

// // Prepare a new notification
// var notification = new apn.Notification();

// // Specify your iOS app's Bundle ID (accessible within the project editor)
// notification.topic = 'com.diantang.cssams';

// // Set expiration to 1 hour from now (in case device is offline)
// notification.expiry = Math.floor(Date.now() / 1000) + 3600;

// // Set app badge indicator
// notification.badge = 3;

// // Play ping.aiff sound when the notification is received
// notification.sound = 'ping.aiff';

// // Display the following message (the actual notification text, supports emoji)
// notification.alert = 'Hello World \u270C';

// // Send any extra payload data with the notification which will be accessible to your app in didReceiveRemoteNotification
// notification.payload = {id: 123};

// // Actually send the notification
// apnProvider.send(notification, deviceToken).then(function(result) {  
//     // Check the result for any failed devices
//     console.log(result);
// });



module.exports = app;
