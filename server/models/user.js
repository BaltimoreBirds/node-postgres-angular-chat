var Bookshelf = require('./bookshelf');
var Promise = require('bluebird');

//Only uses Bookshelf in data structures

// User model
var User = Bookshelf.Model.extend({
  tableName: 'users',

  hasTimestamps: true,

    // Get the user by displayName address, enforces case insensitivity rejects if the user is not found
    // When multi-user support is added, displayName addresses must be deduplicated with case insensitivity, so that
    // joe@bloggs.com and JOE@BLOGGS.COM cannot be created as two separate users.
    getByDisplayName: function getByDisplayName(displayName, options) {
        options = options || {};
        // We fetch all users and process them in JS as there is no easy way to make this query across all DBs
        // Although they all support `lower()`, sqlite can't case transform unicode characters
        // This is somewhat mute, as validator.isdisplayName() also doesn't support unicode, but this is much easier / more
        // likely to be fixed in the near future.
        options.require = true;

        return Users.forge(options).fetch(options).then(function then(users) {
            var userWithdisplayName = users.find(function findUser(user) {
                return user.get('displayName').toLowerCase() === displayName.toLowerCase();
            });
            if (userWithdisplayName) {
                return userWithdisplayName;
            }
        });
    },

    // Finds the user by email, and checks the password
    check: function check(object) {
        var self = this,
            s;
        return this.getByDisplayName(object.displayName).then(function then(user) {
            if (!user) {
                return Promise.reject(new errors.NotFoundError('There is no user with that username address.'));
            }
            if(user.password === this.password){
            	return Promise.resolve(user.set({status: 'active', last_login: new Date() }));
            }
            // if (user.get('status') === 'invited' || user.get('status') === 'invited-pending' ||
            //         user.get('status') === 'inactive'
            //     ) {
            //     return Promise.reject(new Error('The user with that email address is inactive.'));
            // }
            
        }, function handleError(error) {
           	return Promise.reject(error);
        });
    },
});

var Users = Bookshelf.Collection.extend({

  model: User

});

module.exports = User;