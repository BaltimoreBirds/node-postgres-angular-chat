var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');
var Message = require('./message');

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
    
});


var Chats = Bookshelf.Collection.extend({

    model: Chat, 

});

module.exports = Chat;
