var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');
var Message = require('./message');
var ChatUser = require('./chatUser');
var User = require('./user');

//Only uses Bookshelf in data structures

// User model
var Chat = Bookshelf.Model.extend({
    tableName: 'chats',

    hasTimestamps: true,

    users: function(){
        return this.belongsToMany('User').through('ChatUser');
    },
    messages: function(){
        return this.hasMany(Message);
    }
}, {
    createChat: function(user1, user2, callback){
        Chat.forge().save().then(function(chat){
            ChatUser.forge({'user_id': user1, 'chat_id': chat.id}).save().then(function(chatUser){
            });
            ChatUser.forge({'user_id': user2, 'chat_id': chat.id}).save().then(function(chatUser){
            });
            callback(null, chat);
        });
    },
    //Trying to return a collection of the users in the chat with chatID
    getChatUsers: function(chatID, callback){
      console.log('getChatUsers', chatID);
      Chat.forge({'id': chatID})
        .fetch({
          withRelated: ['users']
        }).then( function(chat){
          // console.log('WE HERE CHAT:',chat);
          callback(null, chat);
        })
        .catch(function(err){
          callback(err, null);
        });
    },
});
Bookshelf.model('Chat', Chat);

var Chats = Bookshelf.Collection.extend({

    model: Chat, 

});

module.exports = Chat;
