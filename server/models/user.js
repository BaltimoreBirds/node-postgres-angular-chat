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
        //The promises then method takes two arguments(onFulfilled,onRejected )
        .then( function(users){
            console.log('Then function');
            console.log(users.toJSON());
            callback(users.toJSON());
        } )
        .catch(function(err){
            console.log('catch error');
            callback(err);
        });
    
}

var Users = Bookshelf.Collection.extend({

  model: User

});

module.exports = User;
