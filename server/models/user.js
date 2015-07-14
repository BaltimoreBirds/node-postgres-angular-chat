var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');

//Only uses Bookshelf in data structures

// User model
var User = Bookshelf.Model.extend({
    tableName: 'users',

    hasTimestamps: true,
    
}, {
    getByUsername: function(username, callback){
        Users.forge().fetch({username: username})
            .then( function(user){
                // console.log(username);
                console.log('Then function');
                console.log(user.toJSON());
                callback(null, user);
            } )
            .catch(function(err){
                console.log('catch error');
                callback(err);
            });
        
    }
});


var Users = Bookshelf.Collection.extend({

    model: User, 

    validPassword: function(password){
        if(this.password != password){
            return false;
        }else{
            return true;
        }
    }

});

module.exports = User;
