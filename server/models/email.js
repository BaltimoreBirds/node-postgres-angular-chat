var Bookshelf = require('./bookshelf');

//Email Model
var Email = Bookshelf.Model.extend({
  tableName: 'emails',

  user: function(){
    return this.belongsTo(User, 'id');
  }
});

var Emails = Bookshelf.Collection.extend({

  model: Email

});

module.exports = Email;