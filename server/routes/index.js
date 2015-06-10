var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../','../','client', 'views','index.html'));
});


router.post('/api/v1/messages', function(req, res){

	var results = [];

	//Grab data from http request
	var data = {text: req.body.text};

	//Get a Postgres client from the conneciton pool
	pg.connect(connectionString, function(err, client, done){

		//SQL Query > Insert Data
		client.query("INSERT INTO messages(text) values($1)", [data.text]);

		//SQL Query > Select Data
		var query = client.query("SELECT * FROM messages Order BY id ASC;");

		//Stream results back one row at a time
		query.on('row', function(row){
			results.push(row);
		});

		//After all data is returned, close connection and return results
		query.on('end', function(){
			client.end();
			return res.json(results);
		});

		//Handle errors
		if(err){
			console.log(err);
		}
	});
})

router.get('/api/v1/messages', function(req, res){

	var results= [];

	//Get a Postgres client from the connection pool
	pg.connect(connectionString, function(err, client, done){

		//SQL Query > Select Data
		var query = client.query("SELECT * FROM messages ORDER BY id ASC;");

		//Stream results back one row at a time
		query.on('row', function(row){
			results.push(row);
		});

		//After all data is returned, close connection and return results
		query.on('end', function(){
			client.end();
			return res.json(results);
		});

		//Handle Errors
		if(err){
			console.log(err);
		}

	});

});

router.delete('/api/v1/messages/:message_id', function(req, res){

	var results = [];

	//Grab data from the URL parameters
	var id = req.params.message_id;
	console.log(id);

	//Get a Postgres client from the connection pool
	pg.connect(connectionString, function(err, client, done){

		//SQL query > Delete Data
		client.query("DELETE FROM messages WHERE id=($1)", [id]);

		//SQL Query > Select Data
		var query = client.query("SELECT * FROM messages ORDER BY id ASC");

		//Stream results back one row at a time
		query.on('row', function(row){

			results.push(row);
		});

		//After all data is returned, close connection and return results
		query.on('end', function(){
			client.end();
			return res.json(results);
		});

		//Handle Errors
		if(err){
			console.log(err)
		}
	});

});

module.exports = router;
