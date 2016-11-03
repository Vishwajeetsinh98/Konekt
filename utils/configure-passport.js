var LocalStrategy = require('passport-local');
var User = require(require('path').join(__dirname, '..', 'models', 'user'));


module.exports = (passport)=>{
  var strategy = new LocalStrategy(function(username, password, done){
    var user = null;
    User.findOne({username: username}).then((result)=>{
      if(!result){
        var error = new Error('User Not Found!');
        error.status = 401;
        throw error;
      }
      user = result;
      return user.comparePassword(password);
    })
    .then((match)=>{
      if(!match){
        var error = new Error('Incorrect password');
        error.status = 401;
        throw error;
      }
      return done(null, user);
    })
    .catch(done);
  });

  passport.use(strategy);

  passport.serializeUser((user, done)=>{
    return done(null, user._id);
  })

  passport.deserializeUser((id, done)=>{
    User.findById(id, (err, done)=>{
      return done(err, user);
    })
  })
}
