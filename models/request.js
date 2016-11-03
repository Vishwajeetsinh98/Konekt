var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Request = new mongoose.Schema({
  from: {
    type: ObjectId,
    ref: 'User'
  },
  to: {
    type: ObjectId,
    ref: 'User'
  },
  accept: Boolean
})

module.exports = mongoose.model('Request', Request);
