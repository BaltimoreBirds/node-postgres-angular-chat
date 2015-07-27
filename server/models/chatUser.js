var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');
var Chat = require('./chat');

//Only uses Bookshelf in data structures

// User model
var ChatUser = Bookshelf.Model.extend({
    tableName: 'chats_users',

    hasTimestamps: true,

    user: function(){
    	return this.belongsTo(User);
    },

    chat: function(){
    	return this.belongsTo(Chat);
    }
    
}, {
    createChat: function(user1, user2, callback){
    	// console.log('ID:', user1, user2);
    	Chat.forge().save().then(function(chat){
    		ChatUser.forge({'user_id': user1, 'chat_id': chat.id}).save().then(function(chatUser){
    			// console.log('chatUser1:', chatUser);
    		});
    		ChatUser.forge({'user_id': user2, 'chat_id': chat.id}).save().then(function(chatUser){
    			// console.log('chatUser2:', chatUser);
    		});
    		callback(null, chat.id);
    	});
    }

});


var ChatsUsers = Bookshelf.Collection.extend({

    model: ChatUser, 

});

module.exports = ChatUser;
