var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');


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


});
Bookshelf.model('ChatUser', ChatUser);

var ChatsUsers = Bookshelf.Collection.extend({

    model: ChatUser, 

});

module.exports = ChatUser;
