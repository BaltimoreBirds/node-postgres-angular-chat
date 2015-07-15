var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var passport      = require('passport');
var migrate       = require('migrate');
var flash         = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('./server/models/user');

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, './client', 'public')));

app.use('/', routes);
app.use('/users', users);


passport.serializeUser(function(user, done) {
  console.log('serializeUser called');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser called');
  User.fetch(id, function(err, user) {
    done(err, {firstname: 'JJ', lastname: 'Hardy'});
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Fetching User');
    console.log(username);
    // var user = new User();
    User.getByUsername( {username: username}, function(err, user) {
      console.log('We made it this far!');
      console.log('User: ', user);
      console.log('Error: ', err);
      if (err) { return done(err); }
      if (!user) {
        console.log('Doesn\'t exist');
        return done(null, false, { message: 'Incorrect username.' });
      }
      //check Password
      if ( !user.validPassword( {password: password} )) {
        console.log('checking password');
        return done(null, false, { message: 'Incorrect password.' });
      }else{
        console.log('Cry about it');
      }
      return done(null, user._byID);
    });
  }
));

//use Flash messages
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

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
