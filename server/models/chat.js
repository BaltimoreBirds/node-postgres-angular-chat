var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');
var Message = require('./message');
var ChatUser = require('./chatUser');

//Only uses Bookshelf in data structures

// User model
var Chat = Bookshelf.Model.extend({
    tableName: 'chats',

    hasTimestamps: true,

    users: function(){
        return this.belongsToMany(User).through(ChatUser);
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
    }
});


var Chats = Bookshelf.Collection.extend({

    model: Chat, 

});

module.exports = Chat;
