var express = require('express');
var router = express.Router();
require('dotenv').config();
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.cloudname,
  api_key: process.env.apikey,
  api_secret: process.env.apisecret
});
var User = require(require('path').join(__dirname, '../models/user.js'));
var passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render('index', {flash: null});
})
router.get('/profile', (req, res, next)=>{
  User.findById(req.session.user)
  .populate('posts')
  .populate('notifications')
  .populate('messages')
  .populate('comments')
  .exec((err, user)=>{
    res.render('profile', {data: user});
  })
})

router.get('/list', (req, res, next)=>{
  User.find({})
  .populate('posts')
  .populate('notifications')
  .populate('messages')
  .populate('comments').exec((err, users) => {
    if(!err){
      res.json(users);
    }
  })
});

router.post('/register', (req, res, next)=>{
  var newUser = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    gender: req.body.gender,
    dOB: req.body.dOB,
    photo: null
  });
  if(req.file){
      newUser.photo = req.file.filename;
      newUser.save((err)=>{
        if(err){
          console.log(err);
          var error = new Error('Unable to Save User');
          error.status = 500;
          next(error);
        } else{
            res.render('index', {flash: 'Registered, Login To Continue'});
          }
      });
  } else{
    newUser.save((err, data)=>{
      if(err){
        var error = new Error('Unable to Save User');
        error.status = 500;
        next(error);
      } else{
        res.send('Registered');
      }
    });
  }
});

router.get('/error', (req, res, next)=>{
  res.send('Error');
});

router.route('/login')
  .post(passport.authenticate('local',{failureRedirect: '/error'}), (req ,res, next)=>{
    req.session.user = req.user;
    res.redirect('/users/'+req.user._id);
  });
router.route('/logout')
  .get((req, res, next)=>{
    req.logout();
    res.clearCookie();
    req.session.user = req.user;
    return res.redirect('/');
  });
module.exports = router;
