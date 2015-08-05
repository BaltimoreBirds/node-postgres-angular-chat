var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');
var Chat = require('./chat');
var ChatUser = require('./chatUser');

//Only uses Bookshelf in data structures

// User model
var User = Bookshelf.Model.extend({
    tableName: 'users',

    hasTimestamps: true,

    chats: function(){
        return this.belongsToMany('Chat').through('ChatUser');
    },
    messages: function(){
        return this.hasMany(Message);
    },
    validPassword: function(password){
        // console.log('This:', typeof password); 
        if(this.attributes.password == password){
            return true;            
        }else{
            return false;
        }
    },    
    
}, {
    getByUsername: function(username, callback){
      User.forge({'username': username}).fetch()
        .then( function(user){
          console.log('getByUsername SUCCESS');
          callback(null, user);
        })
        .catch(function(err){
          console.log('getByUsername CATCH ERROR');
          callback(err, null);
        });        
    }, 
    deactivate: function(userID, callback){
      User.forge({'id': userID}).fetch()
        .then(function(user){
          user.set({status: 'inactive'}).save();
        })
        .catch(function(err){
            callback(err, null);
        });             
    },
    doesChatExist: function(currentUser, otherUser, callback){
      User.forge({'id': currentUser}).fetch({
        withRelated: ['chats']
      }).then(function(user){
        var currentUsersChats = user.related('chats');
        // console.log("usersChats", currentUsersChats);
        var myChats = [];
        currentUsersChats.forEach(function(chat, key){
          console.log("FOR EACH CHAT:",chat.id);
          myChats.push(chat.id);
        });
        User.forge({'id': otherUser}).fetch({
          withRelated: ['chats']
        }).then(function(user){
          var otherUsersChats = user.related('chats');
          var theirChats = [];          
          otherUsersChats.forEach(function(chat, key){
            if(myChats.indexOf(chat.id) >= 0){
              //chat with this dude exists
              console.log('EXISTS');
              var exists = true;
              callback(null, 'true');
              exit(0);
            }else{
              var exists = false;
            }
          });
          if(!exists){
            //chat with this dude does not exist
            console.log('DOES NOT EXIST');
            callback(false, 'false');    
          }
        })  
        .catch(function(err){

        });
      })
      .catch(function(err){
        return err;
      })
    }
});
Bookshelf.model('User', User);

var Users = Bookshelf.Collection.extend({

    model: User, 

});

module.exports = User;