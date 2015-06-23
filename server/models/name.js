var Bookshelf = require('./bookshelf');

//Name model
var Name = Bookshelf.Model.extend({
  
  tableName: 'names',
  
  user: function() {
    return this.belongsTo(User, 'id');
  },

});

var Names = Bookshelf.Collection.extend({

  model: Name

});

module.exports = Name;