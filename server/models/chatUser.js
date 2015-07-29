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
    //Trying to return a collection of the users in the chat with chatID
    getChatUsers: function(chatID, callback){
        ChatUser.forge({'chat_id': chatID}).fetch()
          .then(function(chatUsersCollection){
            console.log('Collection: ', chatUsersCollection);
            for(chatUser in chatUsersCollection){
              console.log('Value:', chatUser);
            }
            // res.json({error: false, otherUser: otherUser});
          })
          .catch(function(err){
            callback(err, null)
          });
      }

});


var ChatsUsers = Bookshelf.Collection.extend({

    model: ChatUser, 

});

module.exports = ChatUser;
