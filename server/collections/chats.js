var Bookshelf = require('../models/bookshelf');
var Chat = require('../models/chat');
// var Message = require('../models/message');

var Chats = Bookshelf.Collection.extend({

  model: Chat, 

  // messages: function(){
  // 	return this.hasMany(Message);
  // }

});

module.exports = Chats;