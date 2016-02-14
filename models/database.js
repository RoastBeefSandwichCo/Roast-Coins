"use strict";
var mysql = require('mysql');
var dbProperties = require('../config.json');

function mysqlCallback(error, results){
    if (err) {
         console.log('MYSQL ERR:', error, '\nMYSQL RES:', results)
         return 'error';
     }
     else {
     console.log('results:', results, '\n query.sql:', query.sql);
         //call debugOutput function
     return true;
     }
}


function mysqlConnection(){
    var connection = mysql.createConnection({
      "host": dbProperties.database.mysql.host,
      "port": dbProperties.database.mysql.port,
      "user": dbProperties.database.mysql.user,
      "password": dbProperties.database.mysql.password,
      "database": dbProperties.database.mysql.database,
      "debug": dbProperties.database.mysql.debug
    });
    
    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
    
      console.log('connected as id ' + connection.threadId);
    });
return connection;
}


function createAddressTable(){
    var queryCreateTable = 'CREATE TABLE IF NOT EXISTS external_account_crypto_pairs (id AUTOINCREMENT NOT NULL INT, timestamp NOT NULL INT,'
    + ' crypto_symbol NOT NULL VARCHAR, crypto_address NOT NULL VARCHAR, external_address VARCHAR);';
    var query = mysqlConnection().query(queryCreateTable, mysqlCallback(error, results));
}


var recordNewAddressRelationship = function( cryptoAddress, cryptoSymbol, externalAccount, timestamp){
    var post =  {"timestamp": timestamp, "cryptoSymbol": cryptoSymbol, "cryptoAddress": cryptoAddress, "externalAccount": externalAccount};
    var query = mysqlConnection().query('INSERT INTO external_account_crypto_pairs (timestamp, crypto_symbol, crypto_address, external_account)'
                                 + ' VALUES(?, ?, ?, ?);', [timestamp, cryptoSymbol, cryptoAddress, externalAccount]
                                 , mysqlCallback(error, results));
};


createAddressTable(); // ensure table exists before use
module.exports = {
    "recordNewAddressRelationship": recordNewAddressRelationship()
};




//FOR PG
/*http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/
//var pg = require('pg');
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });*/

//TODO: ADD TO DOC:
//'mysql -u root -p -e "CREATE USER 'test' IDENTIFIED BY 'test';"
//CREATE DATABASE IF NOT EXISTS roast_coins //do not do this programatically. roast_coins does not need that level of privilege.
//
//#lots of code from https://github.com/felixge/node-mysql