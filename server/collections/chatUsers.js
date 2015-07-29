var Bookshelf = require('../models/bookshelf');
var ChatUser = require('../models/chatUser');
// var Message = require('../models/message');

var ChatUsers = Bookshelf.Collection.extend({

  model: ChatUser, 

  // messages: function(){
  // 	return this.hasMany(Message);
  // }

}, {
	  
});

module.exports = ChatUsers;