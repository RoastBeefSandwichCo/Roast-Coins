"use strict";
//var mysql = require('mysql');
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
console.log(knex);

function closeDb(){
    knex.destroy();
}
function mysqlCallback(promise, error, results, fields){
    if (error) {
        console.log('========MYSQL ERR:', error);
        if (error.errno == 1045) {
            console.log("YOU FUCKED UP. Check the db connection settings. Check user existence."
                        + "\nCheck db existence. Check table. Call The Lone Ranger, Dirty Harry, Robocop.");
        }
         promise.resolve();
         return 'error';
        //ECONNREFUSED is mysql running?
        //1064 ER_PARSE_ERROR woops. my bad, dawg.
     }
    if (results) {
        console.log('========RESULTS:', results);
    }
    if (fields) {
        console.log('\n========FIELDS:', fields);
    }
    console.log('nah im here');
//    promise.resolve;
                    //{        then: function(onFulfill, onReject) { onFulfill("fulfilled!"); }    });
    return promise;
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

    knex.schema.createTableIfNotExists('coin_index', function (table) {
        table.increments();
        table.integer('timestamp');
        table.string('crypto_symbol');
        table.string('crypto_address');
        table.string('external_address');
    }).catch(function(error){
        console.log('error in knex table creation');
        })
    .then(function(result){
        console.log('creationResult:', result);
        //return true;
        closeDb();});/*
/*    var queryCreateTable = 'CREATE TABLE IF NOT EXISTS coin_index (id INT AUTO_INCREMENT PRIMARY KEY, timestamp INT, crypto_symbol VARCHAR(255), crypto_address VARCHAR(255), external_address VARCHAR(255));';
    var db = mysqlConnection();
    db.query(queryCreateTable, mysqlCallback);//error, results, fields));
    return;
*/
}


var recordNewAddressRelationship = function( cryptoAddress, cryptoSymbol, externalAccount, timestamp, callback){
    var post =  {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount};
  //  var db = mysqlConnection();
    var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount}
/*    var aPromise = new Promise(function(resolve, reject){
        pending(false);
        resolve(closeDb); //eventually when this randomly starts working, you'll find a #BUG here
        }).then(function (promise){return promise;})
    .then(function(result){result.pending; return result;});
*/
    var knexInsert = knex('coin_index').insert(knexString).then(mysqlCallback)
    .then(function(lastAffectedRow){
        console.log('lastAffectedRow', lastAffectedRow);
        //return true;
        closeDb();});/*
    }).then(aPromise.resolve);
    /*db.query('INSERT INTO coin_index (timestamp, crypto_symbol, crypto_address, external_address)'
                                 + ' VALUES(?, ?, ?, ?);', [timestamp, cryptoSymbol, cryptoAddress, externalAccount]
                                 , mysqlCallback);*/
    console.log('im here');
    return;// aPromise;
};


//#TODO: detect cli invocation for easy table creation
if (process.argv.length > 2) {
    if (process.argv[2] == 'createTable') {
        console.log('CLI invocation. Creating address table.');
        createAddressTable();
    }
}


module.exports = {
    "recordNewAddressRelationship": recordNewAddressRelationship,
    "closeDb": closeDb
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