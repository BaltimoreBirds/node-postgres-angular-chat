var knex = require('knex')({
    client: 'pg',
    connection: {
        host     : 'ec2-54-83-55-214.compute-1.amazonaws.com',
        user     : 'tpqopthjjzjbip',
        password : 'cjcg3Kpfc-KVwNOwKgZu5j2k6l',
        database : 'ddb75r044ashp4',
        charset  : 'utf8',
        ssl		 : true
  }
});
var Bookshelf = require('bookshelf')(knex);
//Registry plugin to register models centrally and make them
//usable as strings to avoid dependency issues
Bookshelf.plugin('registry');

module.exports = Bookshelf;