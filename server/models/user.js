var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');

//Only uses Bookshelf in data structures

// User model
var User = Bookshelf.Model.extend({
    tableName: 'users',

    hasTimestamps: true,


    validPassword: function(password){
        // console.log('This:', typeof password); 
        if(this.attributes.password == password){
            return true;            
        }else{
            return false;
        }
    }
    
}, {
    getByUsername: function(username, callback){
        User.forge({'username': username}).fetch()
            .then( function(user){
                // console.log(username);
                console.log('Then function');
                console.log(user);
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

});

module.exports = User;
