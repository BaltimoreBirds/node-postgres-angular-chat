var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
// application routing
var router = express.Router();
// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.session());

var corsOptions = {
    origin: 'http://localhost:3000'
};

//Websocket Server
// var WebSocket = require('ws');
// var ws = new WebSocket('ws://localhost:3000/path');

// ws.on('open', function open() {
//   ws.send('something');
// });

// ws.on('message', function(data, flags) {
//   // flags.binary will be set if a binary data is received.
//   // flags.masked will be set if the data was masked.
// });

//Models and Collections
var Message = require('../models/message');
var Messages = require('../collections/messages');
var User = require('../models/user');
var Chat = require('../models/chat');
var ChatUser = require('../models/chatUser');
var ChatUsers = require('../collections/chatUsers');
var Chats = require('../collections/chats');


router.route('/')
    .get(function(req, res){
        res.sendFile(path.join(__dirname,'../','../','client', 'views','index.html'));
    })


router.route('/users')
  //fetch all users
  .get(function(req, res){
    Users.forge()
    .fetch()
    .then(function(collection){
      // console.log('collection: '+collection);
      res.json({error: false, data: collection.toJSON()});
    })
    .catch(function(err){
      res.status(500).json({error: true, data:{message: err.message}})
    });
  })
  //create a user
  .post(function(req, res){
    console.log('USER creating', req.body);
    User.forge({
      provider: req.body.provider,
      username: req.body.username,
            password: req.body.password,
            status: 'active',
            last_login: new Date(),
    })
    .save()
    .then(function(user){
      res.json({error: false, data: {id: user.get('id')}});
    })
    .catch(function(err){
      res.status(500).json({error: true, data: {message: err.message}});
    })
  });

router.route('/users/:id')
  // fetch user
  .get(function (req, res) {
    User.forge({id: req.params.id})
    .fetch()
    .then(function (user) {
      if (!user) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: user.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  // update user details
  .put(function (req, res) {
    User.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (user) {
      user.save({
        name: req.body.name || user.get('name'),
        email: req.body.email || user.get('email')
      })
      .then(function () {
        res.json({error: false, data: {message: 'User details updated'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  // delete a user
  .delete(function (req, res) {
    User.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (user) {
        user.destroy()
        .then(function () {
          res.json({error: true, data: {message: 'User successfully deleted'}});
        })
        .catch(function (err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });


// User login
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true })
);

// // Redirect the user to Facebook for authentication.  When complete,
// // Facebook will redirect the user back to the application at
// //     /auth/facebook/callback
// router.get('/auth/facebook', cors(corsOptions), passport.authenticate('facebook'));
  

// // Facebook will redirect the user to this URL after approval.  Finish the
// // authentication process by attempting to obtain an access token.  If
// // access was granted, the user will be logged in.  Otherwise,
// // authentication has failed.
// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/fail',
//                                       failureFlash: true })
//   );


//logout 
router.get('/logout', function(req, res){
    console.log('Is Authenticated: ',req.isAuthenticated());
    req.session.destroy()
    req.logout();
    console.log('logged out...redirecting');
    res.redirect('/');
});


router.route('/chats')
  .get(function(req, res){
    var currentUser = req.session.passport.user;
    // Refactor this block - - Identical block below
    User.forge({'id': currentUser})
      .fetch({
        withRelated: ['chats']
      }).then(function(user){
        var chatCollection = user.related('chats');
        chatCollection.fetch({
          withRelated: ['messages']
          }).then(function(collection){
            res.json({error: false, data: {chats: collection}});
          })
          .catch(function(err){
            res.status(500).json({error: true, data: {message: err.message}});
          });
      })
      .catch(function(err){
        res.status(500).json({error: true, data: {message: err.message}});
      });
      // Refactor this block - - Identical block below
  })
  .post(function(req, res){
    User.getByUsername(req.body.username, function(err, user){
      if(err != null){
        console.log('ERROR NOT NULL');
        res.status(404).json({error: true, data: {message: err.message}});
        return;
      }
      var currentUser = req.session.passport.user;
      console.log('Creating Chat...');
      Chat.createChat(currentUser, user.id, function(err, chat){
        // Refactor this block - - Identical block above
        User.forge({'id': currentUser})
          .fetch({
            withRelated: ['chats']
          }).then(function(user){
            var chatCollection = user.related('chats');
            chatCollection.fetch({
              withRelated: ['messages']
              }).then(function(collection){
                res.json({error: err, data: {chats: collection}});
              })
              .catch(function(err){
                res.status(500).json({error: true, data: {message: err.message}});
              });
          })
          .catch(function(err){
            res.status(500).json({error: true, data: {message: err.message}});
          });
          // Refactor this block - - Identical block above
      });

    });
  });

router.route('/checkLogin')
  .get(function(req, res){
    var currentUser = req.session.passport.user;
    if(currentUser){
      res.json({error: false, user: currentUser, loggedIn: true})
    }else{
      res.json({error: false, user: currentUser, loggedIn: false})
    }
  });

router.route('/messages')
  //fetch all messages
  .get(function(req, res){
    
    Messages.forge()
      .fetch()
      .then(function(collection){
        res.json({error: false, data: collection.toJSON()});
      })
    .catch(function(err){
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  //create a new message
  .post(function(req, res){
    console.log('Is Authenticated: ', req.isAuthenticated());
    var deserializedUser = req.session.passport.user;
    console.log('Body', req.body);
    console.log('text', req.body[req.body.chatID].text);
    Message.forge({user_id: deserializedUser, chat_id: req.body.chatID, text: req.body[req.body.chatID].text})
    .save()
    .then(function(message){
      res.json({error: false, data: {message: message}});
    })
    .catch(function(err){
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

router.route('/messages/:id')
  // fetch all messages
  // .get(function (req, res) {
  //   Message.forge({id: req.params.id})
  //   .fetch()
  //   .then(function (message) {
  //     if(!message) {
  //       res.status(404).json({error: true, data: {}});
  //     }
  //     else {
  //       res.json({error: false, data: message.toJSON()});
  //     }
  //   })
  //   .catch(function (err) {
  //     res.status(500).json({error: true, data: {message: err.message}});
  //   });
  // })   

  // update a message
  // .put(function (req, res) {
  //   Message.forge({id: req.params.id})
  //   .fetch({require: true})
  //   .then(function (message) {
  //     message.save({name: req.body.name || message.get('name')})
  //     .then(function () {
  //       res.json({error: false, data: {message: 'Message updated'}});
  //     })
  //     .catch(function (err) {
  //       res.status(500).json({error: true, data: {message: err.message}});
  //     });
  //   })
  //   .catch(function (err) {
  //     res.status(500).json({error: true, data: {message: err.message}});
  //   });
  // })

  // delete a message
  .delete(function (req, res) {
    console.log('PARAMS:', req.params);
    Message.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (message) {
      message.destroy()
      .then(function () {
        Messages.forge()
          .fetch()
          .then(function(collection){
            res.json({error: false, data: {message: 'Message successfully deleted', collection: collection}});
          });        
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

router.route('/chatUsers/:id')
  .get(function(req, res){
    console.log('CHATID: ', req.params.id);
    Chat.getChatUsers(req.params.id, function(err, chatUsers){
      if(err != null){
        console.log('ERROR NOT NULL');
        res.status(500).json({error: true, data: {message: err.message}});
        return;
      }
      console.log(chatUsers);
      res.json({error: null, data: chatUsers});
    });
  });

module.exports = router;