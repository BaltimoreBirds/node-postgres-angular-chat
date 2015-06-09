var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chat';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE messages(id SERIAL PRIMARY KEY, text VARCHAR(1000) not null)');
query.on('end', function() {client.end(); });