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

router.get('/:postId', (req, res, next)=>{
    Post.findById(req.params.postId)
    .populate('likes', 'name')
    .exec((err, post)=>{
        if(err){
            console.log(err)
            var error = new Error('Cant Get Post');
            error.status = 500;
            next(error);
        } else{
            res.json(post);
        }
    })
})

router.get('/likepost', (req, res, next)=>{
  Post.findByIdAndUpdate(req.query.postId, {$push: {likes: req.session.user._id}}, (err)=>{
    if(err){
      console.log(err);
      var error = new Error('Unable To Like');
      error.status = 500;
      next(error);
    } else{
      res.send('Liked');
    }
  })
});

router.post('/comment', (req, res, next)=>{
    var query = {$push: {comments: {by: req.session.user._id, comment: req.body.comment}}};
    Post.findByIdAndUpdate(req.body.postId, query, (err)=>{
        if(err){
            console.log(err);
            var error = new Error('Unable To Comment');
            error.status = 500;
            next(error);
        } else{
            res.send('Commented');
        }
    })
})

module.exports = router;