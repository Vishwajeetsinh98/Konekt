var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Message = new mongoose.Schema({
  from: {
    type: ObjectId,
    ref: 'User'
  },
  to: {
    type: ObjectId,
    ref: 'User'
  },
  fromName: String,
  fromImage: String,
  toName: String,
  content: String,
  when: Date
});
module.exports = mongoose.model('Message', Message);
