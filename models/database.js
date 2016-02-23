"use strict";
var dbProperties = require('../config/config.json');
require('mysql');
var knex = require('knex')({
    client: dbProperties.database.client.toLowerCase(),
    connection: {
        host: dbProperties.database[dbProperties.database.client].host,
        port: dbProperties.database[dbProperties.database.client].port,
        user: dbProperties.database[dbProperties.database.client].user,
        password: dbProperties.database[dbProperties.database.client].password,
        database: dbProperties.database[dbProperties.database.client].database
//        debug: dbProperties.database[dbProperties.database.client].debug
    }
});
//console.log(knex);

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

function createTablesAll() {
    //call all creation functions here
    //build a list of their results, return list.
/*    createTableCoinIndex()
                .then(function(result){
                    console.log(result);
                });*/
    createTableCoinIndex()
    .then(function(result){
        //console.log('RESULT:',result);
        createTableExternalTransactions()
          .then(function(result){
            //console.log('RESULTX:',result);
            createTableLastBlockIndex()
                .then(function(result){
              //      console.log('RESULTX', result);
                    closeDb();
                })
          })
    });
}

function createTableCoinIndex(){
    var x = knex.schema.createTableIfNotExists('coin_index', function (table) {
        table.increments();
        table.integer('timestamp');
        table.string('crypto_symbol');
        table.string('crypto_address');
        table.string('external_address');
    }).catch(function(error){
        console.log('error in knex table creation: coin_index');
        });
    /*.then(function(result){
        //console.log('creationResult:', result);
        //return true;
        return result;
    });*/
    return x;
};

function createTableExternalTransactions() {  //records blockchain transaction info and associated external address
    var x = knex.schema.createTableIfNotExists('external_transactions', function (table) {
        table.increments();
        table.integer('timestamp');
        table.string('crypto_symbol');
        table.string('crypto_address');
        table.string('external_address');
        table.boolean('direction');
        table.boolean('finished');
        table.string('bc_blockhash'); /*fields by rpc-reported name from blockchain client*/
        table.integer('bc_blockindex');
        table.integer('bc_blocktime');
        table.string('bc_txid');
        table.integer('bc_time');
        table.integer('bc_timereceived');
        
    }).catch(function(error){
        console.log('error in knex table creation: external_transactions');
        })
    return x;
    /*.then(function(result){
        //console.log('creationResult:', result);
        return result;
    });*/
    //varchar 255 string external_address, bool? direction, bool? finished(edited)
}

function createTableLastBlockIndex(){ //tracks the last block for which we have processed all transactions #TODO: what happens when they're
    //partially processed?
    var x = knex.schema.createTableIfNotExists('last_block_index', function (table) {
        table.increments();
        table.integer('timestamp');
        table.string('crypto_symbol');
        table.string('block_hash');
    }).catch(function(error){
        console.log('error in knex table creation: last_block_index');
        });
    return x;
    /*.then(function(result){
        //console.log('creationResult:', result);
        return result;
    });*/
}

function getLastBlockChecked(cryptoSymbol, callback) {
    var last_checked = knex.select('block_hash').from('last_block_index').where('crypto_symbol', cryptoSymbol)
    .orderBy('id', 'desc')
    .limit(1)
    .then(callback);
    console.log('last_checked = ', last_checked);
    return last_checked;
}

var getExternalAddress = function(cryptoAddress){
    externalAddress = knex.select('external_address').from('coin_index').where('crypto_address', cryptoAddress).limit(1);
    console.log('address pair:', cryptoAddress, externalAddress);
    return externalAddress;
    
}
var recordLastBlockChecked = function (cryptoSymbol, blockHash, timestamp){
    var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, blockHash}
    var knexInsert = knex('last_block_index').insert(knexString).then(dbCallback)
    .then(function(lastAffectedRow){
        console.log('lastAffectedRow', lastAffectedRow);
        //return true;
        closeDb();});
    console.log('Inserting record into last_block_index');
    return;
    
}
var recordNewAddressRelationship = function( cryptoAddress, cryptoSymbol, externalAccount, timestamp, callback){
//comment out, test, remove    var post =  {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount};
  //  var db = mysqlConnection();
    var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "crypto_address": cryptoAddress, "external_address": externalAccount}
    var knexInsert = knex('coin_index').insert(knexString).then(dbCallback)
    .then(function(lastAffectedRow){
        console.log('lastAffectedRow', lastAffectedRow);
        //return true;
        closeDb();});
    console.log('Inserting record into coin_index');
    return;
};


//#TODO: detect cli invocation for easy table creation
if (process.argv.length > 2) {
    if (process.argv[2] == 'createTables') {
        console.log('CLI invocation. Creating address table.');
        createTablesAll();
    }
}


module.exports = {
    "closeDb": closeDb,
    "getLastBlockChecked": getLastBlockChecked,
    "recordNewAddressRelationship": recordNewAddressRelationship
};


//#TODO: all create functions should return values
//#TODO: #FIXME: closDb at the end of functions is bullshit. fixit.
//#TODO: make this WAY more efficient.
//TODO: ADD TO DOC:
//'mysql -u root -p -e "CREATE USER 'test' IDENTIFIED BY 'test';"
//CREATE DATABASE IF NOT EXISTS roast_coins //do not do this programatically. roast_coins does not need that level of privilege.
//
//#lots of code from https://github.com/felixge/node-mysql