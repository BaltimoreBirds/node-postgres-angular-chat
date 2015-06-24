var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');

//Only uses Bookshelf in data structures

// User model
var User = Bookshelf.Model.extend({
    tableName: 'users',

    hasTimestamps: true,


    

});

User.getByUsername = function(username, callback){
    Users.forge().fetch({username:username})
        .then( function callback(users){
            console.log('Then function');
            return users;
        } )
        .catch(function(err){
            console.log('error');
            callback(err);
        });
    
}

var Users = Bookshelf.Collection.extend({

  model: User

});

module.exports = User;
