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
        return this.belongsToMany(Chat).through(ChatUser);
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
        
    }
});


var Users = Bookshelf.Collection.extend({

    model: User, 

});

module.exports = User;