var mongoose = require('mongoose');
var Promise = require('bluebird');
var bcrypt;
if(process.platform == 'win32'){
  bcrypt = Promise.promisifyAll(require('bcryptjs'));
} else{
  bcrypt = Promise.promisifyAll(require('bcrypt'));
}

var SALT = 10;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var User = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  phone: String,
  gender: String,
  dOB: Date,
  photo: String,
  notifications: [{
    type: ObjectId,
    ref: 'Post'
  }],
  messages: [{
    type: ObjectId,
    ref: 'Message'
  }],
  posts: [{
    type: ObjectId,
    ref: 'Post'
  }],
  friends: [{
    type: ObjectId,
    ref: 'User'
  }],
  requests: [{
    type: ObjectId,
    ref: 'Request'
  }]
});
User.methods.comparePassword = function(enteredPassword){
  return bcrypt.compareSync(enteredPassword, this.password);
};
User.pre('save', function(next){
  var user = this;
  if(!user.isModified('password'))
    return next();
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

module.exports = mongoose.model('User', User);
