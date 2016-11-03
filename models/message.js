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
  content: String,
  when: Date
});
module.exports = mongoose.model('Message', Message);
