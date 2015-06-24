var express          = require('express');
var path             = require('path');
var favicon          = require('serve-favicon');
var logger           = require('morgan');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var session          = require('express-session');
var passport         = require('passport');
var migrate          = require('migrate');
var flash            = require('connect-flash');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var cors             = require('cors');
var Promise          = require('bluebird')

var routes = require('./server/api/index');
var users = require('./server/routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname,'client', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
 }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, './client', 'public')));

app.use('/', routes);
app.use('/users', users);


//use Flash messages
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

passport.use(new LocalStrategy(
  //done is the callback dumby

  function(username, password, done){
    console.log('LocalStrategy!');
    User.fetch({displayName: username}, function(err, user){
      if(err){ return done(err);}

      if(!user){
        return done(null, false, {message: 'Incorrect username.'});
      }

      if(!user.check()){
        console.log('checked!');
        return done(null, false, {message: 'Incorrect password.'});
      }

      return done(null, user);
    })

  }));

// var fBSecret = require('./key');
// passport.use(new FacebookStrategy({
//     clientID: 1001248296575066,
//     clientSecret: fBSecret,
//     callbackURL: "http://localhost:3000/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(profile)
//     // User.forge({id:, function(err, user) {
//     //   if (err) { return done(err); }
//     //   done(null, user);
//     // });
//   }
// ));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser called');
  User.findById(id, function(err, user) {
    done(err, {firstname: 'Bob', lastname: 'Hardy'});
  });
});


// //Allow Cross Origin Requests
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//   next();
// });

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
