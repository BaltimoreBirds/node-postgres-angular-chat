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

module.exports = Bookshelf;