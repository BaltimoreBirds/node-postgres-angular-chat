var knex = require('knex')({
    client: 'pg',
    connection: {
        host     : 'ec2-204-236-226-63.compute-1.amazonaws.com',
        user     : 'kvimdzxrahtabs',
        password : '2zIgeT-Xrga02UMhubnquL5q2f',
        database : 'd75kv4ska29qoq',
        charset  : 'utf8'
  }
});
var Bookshelf = require('bookshelf')(knex);
//Registry plugin to register models centrally and make them
//usable as strings to avoid dependency issues
Bookshelf.plugin('registry');

module.exports = Bookshelf;