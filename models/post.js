var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Post = new mongoose.Schema({
  who: {
    type: ObjectId,
    ref: 'User'
  },
  content: String,
  photo: String,
  tags: [{
    type: ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: ObjectId,
    ref: 'User'
  }],
  comments: [{
    by: {
      type: ObjectId,
      ref: 'User'
    },
    comment: String
  }]
});

module.exports = mongoose.model('Post', Post);
