var Bookshelf = require('./bookshelf');

//Photo Model
var Photo = Bookshelf.Model.extend({
  tableName: 'photo',

  user: function(){
    return this.belongsTo(User, 'id');
  }
});

var Photos = Bookshelf.Collection.extend({

  model: Photo
});

module.exports = Photo;