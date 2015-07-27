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

//Models and Collections
var Message = require('../models/message');
var Messages = require('../collections/messages');
var User = require('../models/user');
var ChatUser = require('../models/chatUser');
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
    // console.log('We HERE?', currentUser);
    User.forge({'id': currentUser}).fetch({
          withRelated: ['chats']
        }).then(function(user){
          var chatCollection = user.related('chats');
          // console.log('ChatCollection: ', chatCollection);
          chatCollection.fetch({
            withRelated: ['messages']
            }).then(function(collection){
              // console.log('Chat Collection w/ realtion: ', collection);
              res.json({error: err, data: {chats: collection}});
            })
            .catch(function(err){
              res.status(500).json({error: true, data: {message: err.message}});
            });
        })
        .catch(function(err){
          res.status(500).json({error: true, data: {message: err.message}});
        });
  })
  .post(function(req, res){
    console.log(req.body);
    User.getByUsername(req.body.username, function(err, user){
      console.log('Creating Chat...');
      console.log('Current User:', req.session.passport.user);
      var currentUser = req.session.passport.user;
      ChatUser.createChat(currentUser, user.id, function(err, chat){
        User.forge({'id': currentUser})
          .fetch({
            withRelated: ['chats']
          }).then(function(user){
            // console.log('Users relation: ', user);
            // console.log('Users chats: ', user.related('chats').toJSON());
            var chatCollection = user.related('chats');
            console.log('ChatCollection: ', chatCollection);
            chatCollection.fetch({
              withRelated: ['messages']
              }).then(function(collection){
                console.log('Chat Collection w/ realtion: ', collection);
                res.json({error: err, data: {chats: collection}});
              })
              .catch(function(err){
                res.status(500).json({error: true, data: {message: err.message}});
              });
          })
          .catch(function(err){
            res.status(500).json({error: true, data: {message: err.message}});
          });
      });

    });
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
    console.log('deserializedUserID', deserializedUser);
    console.log('chatId', req.body);
		Message.forge({user_id: deserializedUser, chat_id: req.body.chatId, text: req.body.text})
		.save()
		.then(function(message){
            Messages.forge()
                .fetch()
                .then(function(messages){
                  res.json({error: false, data: {id: message.get('id'), messages: messages}});
                });
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


module.exports = router;
