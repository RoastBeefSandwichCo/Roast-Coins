"use strict";
var dbProperties = require('../config/config.json');
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
function dbCallback(error, results, fields){
    if (error) {
        console.log('========MYSQL ERR:', error);
         return 'error';
     }
    if (results) {
        console.log('========RESULTS:', results);
    }
    if (fields) {
        console.log('\n========FIELDS:', fields);
    }
    console.log('nah im here');

    return promise;
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
        closeDb();});
}


var recordNewAddressRelationship = function( cryptoAddress, cryptoSymbol, externalAccount, timestamp, callback){
    var post =  {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount};
  //  var db = mysqlConnection();
    var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount}
    var knexInsert = knex('coin_index').insert(knexString).then(dbCallback)
    .then(function(lastAffectedRow){
        console.log('lastAffectedRow', lastAffectedRow);
        //return true;
        closeDb();});
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
    "recordNewAddressRelationship": recordNewAddressRelationship,
    "closeDb": closeDb
};


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