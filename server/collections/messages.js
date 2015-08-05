var Bookshelf = require('../models/bookshelf');
var Message = require('../models/message');

var Messages = Bookshelf.Collection.extend({

  model: Message

});

module.exports = Messages;