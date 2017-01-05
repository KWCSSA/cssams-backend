var winston = require('winston');
require('winston-mongodb').MongoDB;

var options = {
	db:"mongodb://localhost/cssams",
}

var logger = new (winston.Logger)();

logger.add(winston.transports.Console);
logger.add(winston.transports.MongoDB, options);
logger.add(winston.transports.File, {filename: 'winston.log'});

module.exports = logger;

