"use strict";
var mysql = require('mysql');
var dbProperties = require('../config/config.json');
//var x = dbProperties.database.client
//var y = x.toString().toLowerCase();
//console.log('y:', y);
var knex = require('knex')({
    client: dbProperties.database.client.toLowerCase(),
    connection: {
        host: dbProperties.database[dbProperties.database.client].host,
        port: dbProperties.database[dbProperties.database.client].port,
        user: dbProperties.database[dbProperties.database.client].user,
        password: dbProperties.database[dbProperties.database.client].password,
        database: dbProperties.database[dbProperties.database.client].database,
        debug: dbProperties.database[dbProperties.database.client].debug
    }
});

function mysqlCallback(error, results, fields){
    if (error) {
        console.log('MYSQL ERR:', error);
        if (error.errno == 1045) {
            console.log("YOU FUCKED UP THE CREDENTIALS, forgot to create a user, a database, etc. Or, you know. The script"
                        + "\ncould be broken. Which would be my bad. But I blame YOU."
                        + "\nIn MySQL:\n CREATE USER 'roast_coins'@'localhost' IDENTIFIED BY 'mypass';"
                        + "\nCREATE DATABASE roast_coins;\nGRANT ALL PRIVILEGES ON roast_coins TO roast_coins@'localhost';"
                        + "\nUse @'localhost' only if the database server is local.");
        }
         return 'error';
        //ECONNREFUSED is mysql running?
        //1064 ER_PARSE_ERROR woops. my bad, dawg.
     }
    if (results) {
        console.log('RESULTS:', results);
    }
    if (fields) {
        console.log('\nFIELDS:', fields);
    }
    console.log('nah im here');
    return;
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
    //console.log('dbProperties.blahblah', dbProperties.database.mysql);
    connection.on('error', function(err) {
      console.log('ERROR! HUZZAH!!!', err.code); // #TODO: do something with this
    });
    /*connection.connect(function(err) {
      if (err) {
        console.log('error connecting: ' + err.stack);
        return;
      }
      console.log('connected as id ' + connection.threadId);
    });
    
    if (connection.threadId === null) {
        console.error('NOT CONNECTED TO DATABASE!');
        return 'error';
    }
//console.log('mysqlConnection success');
    */
return connection;
}


function createAddressTable(){
    var queryCreateTable = 'CREATE TABLE IF NOT EXISTS breasticles (id INT AUTO_INCREMENT PRIMARY KEY, timestamp INT, crypto_symbol VARCHAR(255), crypto_address VARCHAR(255), external_address VARCHAR(255));';
    var db = mysqlConnection();
    db.query(queryCreateTable, mysqlCallback);//error, results, fields));
    return;
}


var recordNewAddressRelationship = function( cryptoAddress, cryptoSymbol, externalAccount, timestamp){
    var post =  {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount};
    var db = mysqlConnection();
    var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount}
    var knexInsert = knex('breasticles').insert(knexString).asCallback(mysqlCallback);
    /*db.query('INSERT INTO breasticles (timestamp, crypto_symbol, crypto_address, external_address)'
                                 + ' VALUES(?, ?, ?, ?);', [timestamp, cryptoSymbol, cryptoAddress, externalAccount]
                                 , mysqlCallback);*/
    console.log('im here');
    return;
};


//#TODO: detect cli invocation for easy table creation
if (process.argv.length > 2) {
    if (process.argv[2] == 'createTable') {
        console.log('CLI invocation. Creating address table.');
        createAddressTable();
    }
}


module.exports = {
    "recordNewAddressRelationship": recordNewAddressRelationship
};


//createAddressTable();

//FOR PG
/*http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/
//var pg = require('pg');
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });*/

//#TODO: make this WAY more efficient.
//TODO: ADD TO DOC:
//'mysql -u root -p -e "CREATE USER 'test' IDENTIFIED BY 'test';"
//CREATE DATABASE IF NOT EXISTS roast_coins //do not do this programatically. roast_coins does not need that level of privilege.
//
//#lots of code from https://github.com/felixge/node-mysql