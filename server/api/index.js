var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
// application routing
var router = express.Router();
// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//Models and Collections
var Message = require('../models/message');
var Messages = require('../collections/messages');
var User = require('../models/user');


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
    console.log(req.body.provider);
		User.forge({
			provider: req.body.provider,
			displayName: req.body.displayName
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

router.route('/messages')
	//fetch all messages
	.get(function(req, res){
    // console.log(Messages);
		Messages.forge()
		.fetch()
		.then(function(collection){
      // console.log('collection: '+ collection);
			res.json({error: false, data: collection.toJSON()});
		})
		.catch(function(err){
			res.status(500).json({error: true, data: {message: err.message}});
		});
	})

	//create a new message
	.post(function(req, res){
		Message.forge({user_id: req.body.user_id, text: req.body.text})
		.save()
		.then(function(message){
			res.json({error: false, data: {id: message.get('id')}});
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
    console.log(req.params);
    Message.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (message) {
      message.destroy()
      .then(function () {
        res.json({error: true, data: {message: 'Message successfully deleted'}});
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
