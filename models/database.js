var mysql = require('node-mysql');
var dbProperties = require('../config.json');

//read config and open db connection appropriately
//check-init
  //function does db exist
  //create if not exists table

var connection = mysql.createConnection(dbProperties);

connection.query();


function connectTo(args) { // create database if not exists
    //code
}

//Primary key IDs auto increment as an integer and are not null.
//CREATE if not exists DATABASE Roast_Coins
//CREATE if NOT EXISTS table accountCoinAddresses (id autoincrement not null int, ripple NOT NULL varchar(60) )



/*http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/
//var pg = require('pg');
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });*/

//TODO: ADD TO DOC: 'mysql -u root -p -e "CREATE USER 'test' IDENTIFIED BY 'test';"