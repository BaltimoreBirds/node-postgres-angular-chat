var Bookshelf = require('./bookshelf');

//Message model
var Message = Bookshelf.Model.extend({
  tableName: 'messages',

  hasTimestamps: true,

  user: function(){
    return this.belongsTo(User);
  },
  chat: function(){
  	return this.belongsTo(Chat)
  }

});

module.exports = Message;