var Bookshelf = require('../models/bookshelf');
var User = require('../models/user');
// var Message = require('../models/message');

var Users = Bookshelf.Collection.extend({

  model: User, 

  // messages: function(){
  // 	return this.hasMany(Message);
  // }

});

module.exports = Users;