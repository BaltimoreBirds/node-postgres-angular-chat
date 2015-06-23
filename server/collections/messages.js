var Bookshelf = require('../models/bookshelf');
var Message = require('../models/Message');

var Messages = Bookshelf.Collection.extend({

  model: Message

});

module.exports = Messages;