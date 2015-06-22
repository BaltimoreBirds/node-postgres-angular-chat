var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var migrate = require('migrate');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./server/routes/index');
var users = require('./server/routes/users');


var knex = require('knex')({
    client: 'pg',
    connection: {
        host     : '127.0.0.1',
        user     : 'mswanson',
        // password : 'your_database_password',
        database : 'chat',
        charset  : 'utf8'
  }
});
var Bookshelf = require('bookshelf')(knex);

//Only uses Bookshelf in data structures

// User model
var User = Bookshelf.Model.extend({
  tableName: 'users',

  hasTimestamps: true,
});

//Message model
var Message = Bookshelf.Model.extend({
  tableName: 'messages',

  hasTimestamps: true,

  user: function(){
    return this.belongsTo(User, 'id');
  }

});

//Name model
var Name = Bookshelf.Model.extend({
  
  tableName: 'names',
  
  user: function() {
    return this.belongsTo(User, 'id');
  },

});

//Email Model
var Email = Bookshelf.Model.extend({
  tableName: 'emails',

  user: function(){
    return this.belongsTo(User, 'id');
  }
});

//Photo Model
var Photo = Bookshelf.Model.extend({
  tableName: 'photo',

  user: function(){
    return this.belongsTo(User, 'id');
  }
});




passport.use(new LocalStrategy(
  //done is the callback dumby
  function(username, password, done){

    User.findOne({username: username}, function(err, user){
      if(err){ return done(err);}

      if(!user){
        return done(null, false, {message: 'Incorrect username.'});
      }

      if(!user.validPassword(password)){

        return done(null, false, {message: 'Incorrect password.'});
      }

      return done(null, user);
    })

  }));

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
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client', 'public')));

app.use('/', routes);
app.use('/users', users);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser called');
  User.findById(id, function(err, user) {
    done(err, {firstname: 'Bob', lastname: 'Hardy'});
  });
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
