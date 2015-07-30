var knex = require('knex')({
    client: 'pg',
    connection: {
        host     : '127.0.0.1',
        user     : 'mswanson',
        // password : 'your_database_password',
        database : 'chat',
        charset  : 'utf8'
  }
});
var Bookshelf = require('bookshelf')(knex);
//Registry plugin to register models centrally and make them
//usable as strings to avoid dependency issues
Bookshelf.plugin('registry');

module.exports = Bookshelf;