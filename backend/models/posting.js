var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Account' },
  content: String,
  likes: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
  isAnon: { type: Boolean, default: false },
  anonName: String,
  createdAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  replies: [{
    rid: Number,
    content : String,
    user : { type: Schema.Types.ObjectId, ref: 'Account' },
    isAnon: { type: Boolean, default: false},
    anonName: String,
    createdAt: { type: Date, default: Date.now }
 }]
});

module.exports = mongoose.model('Posting', PostingSchema);
