var Bookshelf = require('./bookshelf');

//Only uses Bookshelf in data structures

// User model
var User = Bookshelf.Model.extend({
  tableName: 'users',

  hasTimestamps: true,
});

var Users = Bookshelf.Collection.extend({

  model: User

});

module.exports = User;