var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var routes = require('./routes/index');
var users = require('./routes/users');
var dotenv = require('dotenv').config();
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var session = require('cookie-session');
var multer = require('multer');
var crypto = require('crypto');

require(path.join(__dirname, 'utils', 'configure-passport'))(passport);
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGODB_URI);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})
app.use(multer({ dest: './uploads/', storage: storage}).single('image'));
app.use(session({
  keys: ['keyboard', 'cat'],
  secret: process.env.COOKIE_SECRET || 'secret',
  cookie: {
    secure: true,
    expires: new Date( 5 * Date.now() + 60 * 60 * 1000 )
  }
}))
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
