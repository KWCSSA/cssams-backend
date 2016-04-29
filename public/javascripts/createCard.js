var fs = require('fs') , 
	gm = require('gm').subClass({imageMagick: true});
var DBService = require('./DBService');
function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding);
}



var CardCreator = {
	createCard: function(user_fname,user_lname,user_memid,cb) {

	var card_width = 400;
	var card_height = 250;
	var name_height_offset = 20; // same as font-size
	var card_height_offset = 32;
	var width_start_position = 0.3;

	var card_owner_text = user_fname.toUpperCase() + "  " + user_lname.toUpperCase();
	user_memid = user_memid.toString();
	var card_number_text = user_memid.substring(0,4)+ "  "+ user_memid.substring(4,8)+ "  "+ user_memid.substring(8,12);
	if (card_owner_text.length < 16) {
        width_start_position = width_start_position + (16 - card_owner_text.length)*0.03;
     }

	gm('public/images/card.png')
	.resize(card_width,card_height)
	.font('public/images/arial.ttf')
	.fill("rgb(239,220,155)")
	.fontSize(name_height_offset)
	.drawText(card_width*width_start_position,card_height*0.72+name_height_offset,card_owner_text)
	.font('public/images/kredit_front.ttf')
	.fontSize(card_height_offset)
	.fill("rgb(255,255,255)")
	.drawText(card_width*0.084,card_height*0.42+name_height_offset,card_number_text)
	.write('public/cards/'+user_memid+'.png',function(err) {
		if(err) cb(err,null);
		else {
			cb(null,"http://tangdian.ca:5500/cards/"+user_memid+".png");
		}
	});



}
};


// 	
module.exports = CardCreator;