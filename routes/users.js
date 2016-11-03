var express = require('express');
var router = express.Router();
var Post = require(require('path').join(__dirname, '../models/post.js'));
var Message = require(require('path').join(__dirname, '../models/message.js'));
var User = require(require('path').join(__dirname, '../models/user.js'));
var Request = require(require('path').join(__dirname, '../models/request.js'));

router.use((req, res, next)=>{
  if(req.session.user){
    next();
  } else{
    var error = new Error('Not Logged In!');
    error.status = 403;
    next(error);
  }
});

router.get('/:userId', (req, res, next)=>{
  User.findById(req.params.userId)
  .populate('notifications')
  .populate('messages')
  .populate('requests')
  .populate('friends', 'name photo _id')
  .populate('posts')
  .exec((err, user)=>{
    if(err){
      console.log(err);
      var error = new Error('Unable To Get User');
      error.status = 500;
      next(error);
    } else{
      res.json(user);
    }
  })
});

router.post('/addnewpost', (req, res, next)=>{
  var newPost = new Post({
    who: req.session.user._id,
    name: req.session.user.name,
    content: req.body.content,
    photo: req.file ? req.file.filename : null,
    comments: [],
    tags: [req.body.tags],
    likes: [],
    comments: null
  });
  newPost.save((err, post)=>{
    if(err){
      console.log(err);
      var error = new Error('Cant Save Post');
      error.status = 500;
      next(error);
    } else{
      User.findByIdAndUpdate(req.session.user._id, {$push: {posts: post._id}}, (err)=>{
        if(err){
          console.log(err);
          var error = new Error('Cant Save Post');
          error.status = 500;
          next(error);
        } else{
          User.update({_id: {$in: req.session.user.friends}}, {$push: {notifications: post._id}}, (err)=>{
            if(err){
              console.log(err);
              var error = new Error('Cant Save Post');
              error.status = 500;
              next(error);
            } else{
              res.send('Posted');
            }
          })
        }
      })
    }
  });
});
router.post('/request', (req, res, next)=>{
  var newRequest = new Request({
    from: req.session.user._id,
    to: req.body.to
  });
  newRequest.save((err, request) => {
    if(err){
      console.log(err);
      var error = new Error('Unable To Request!');
      error.status = 500;
      next(error);
    } else{
      User.findByIdAndUpdate(req.body.to, {$push: {requests: request._id}}, (err)=>{
        if(err){
          console.log(err);
          var error = new Error('Unable To Request!');
          error.status = 500;
          next(error);
        } else{
          res.send('Done');
        }
      })
    }
  })
})

router.put('/request', (req, res, next)=>{
  Request.remove({_id: req.body.requestId}, (err)=>{
    if(err){
      console.log(err);
      var error = new Error('Unable to Answer request');
      error.status = 500;
      next(error);
    } else{
      var query = req.body.accept ? {$pull: {requests: req.body.requestId}, $push: {friends: req.body.sender}} : {$pull: {requests: req.body.requestId}};
      User.findByIdAndUpdate(req.session.user._id, query, (err)=>{
        if(err){
          console.log(err);
          var error = new Error('Unable To answer Request');
          error.status = 500;
          next(error);
        } else{
          User.findByIdAndUpdate(req.body.sender, {$push: {friends: req.session.user._id}}, (err)=>{
            if(err){
              console.log(err);
              var error = new Error('Unable To answer Request');
              error.status = 500;
              next(error);
            } else{
              res.send('Accepted');
            }
          })
        }
      })
    }
  })
});

module.exports = router;
