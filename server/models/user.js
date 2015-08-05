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
        console.log("~~~~~~~ 1 ~~~~~~~~~");
        console.log("LENGTH", myChats.length);
        if(myChats.length > 0){
          console.log("~~~~~~~ 2 ~~~~~~~~~");
          User.forge({'id': otherUser}).fetch({
            withRelated: ['chats']
          }).then(function(user){            
            var otherUsersChats = user.related('chats');
            var theirChats = []; 
            console.log("~~~~~~~ 3 ~~~~~~~~~");
            console.log("LENGTH", otherUsersChats.length);
            if(otherUsersChats.length > 0){    
              console.log("~~~~~~~ 4 ~~~~~~~~~");     
              otherUsersChats.forEach(function(chat, key){
                console.log("~~~~~~~ 5 ~~~~~~~~~");
                if(myChats.indexOf(chat.id) >= 0){
                  //chat with this dude exists
                  console.log('EXISTS');
                  return( callback(null, 'true') );
                }
              });
            }else{
              callback(null, 'false');
            }
          })  
          .catch(function(err){
            return( callback(err, null) );
          });
        }else{
          return( callback(null, 'false') );
        }
      })
      .catch(function(err){
        return( callback(err, null) );
      })
    }
});
Bookshelf.model('User', User);

var Users = Bookshelf.Collection.extend({

    model: User, 

});

module.exports = User;