var express = require('express');
var router = express.Router();
var logger = require('../backend/logger.js');

/* GET info and posting of a user 
example: {
	idnum: xxx,
	fname: xxx,
	lname: xxx,
	email: xxx,
	posting: []
}
*/
router.get('/:id', function(req, res, next) {

}


module.exports = router;
