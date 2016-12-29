var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostingSchema = new Schema({
  user: { type: Number, ref: 'Account' }
  content: String,
  likes: Number,
  anonName: String,
  createdAt: { type: Date, default: Date.now },
  replies: [{
  				 rid: Number, 
  				 content : String, 
  				 user : { type: Number, ref: 'Account' },
  				 anonName: String,
  				 createdAt: { type: Date, default: Date.now }
  				 }]
});

module.exports = mongoose.model('Posting', PostingSchema);
