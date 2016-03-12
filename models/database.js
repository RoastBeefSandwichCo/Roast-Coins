"use strict";
var dbProperties = require('../config/config.json');
//require('mysql');
/*if (dbProperties.database.client.toLowerCase() === 'postgresql'){
require ('pg');
*/
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
//}
console.log(knex);

function closeDb(){
    knex.destroy();
}
function dbCallback(results, results2, fields){ //suspect first field can be returned value or error. #TODO: parse appropriately
    if (results) {
        console.log('========MYSQL RESULTS:', results);
         return results;
     }
    if (results) {
        console.log('========RESULTS2:', results2);
    }
    if (fields) {
        console.log('\n========FIELDS:', fields);
    }
    console.log('nah im here');
    console.log(results, results2, fields)
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
    var x = knex.schema.createTableIfNotExists('blockchain_transactions', function (table) {
        table.increments();
        table.string('crypto_address');
        table.string('crypto_symbol');
        table.string('external_address');
        table.boolean('finished');  // Finished = 0 = False = Pending.
        table.boolean('is_inbound');  //0 = false = outbound
        table.integer('rc_timestamp'); //When the block notification was received by Roast Coins
        table.string('bc_blockhash'); /*fields by rpc-reported name from blockchain client*/
        table.decimal('bc_amount');
        table.integer('bc_blockindex');
        table.integer('bc_blocktime');
        table.integer('bc_time');
        table.integer('bc_timereceived');
        table.string('bc_txid');
    }).catch(function(error){
        console.log('error in knex table creation: blockchain_transactions');
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
    var last_checked = knex
    .select('block_hash')
    .from('last_block_index')
    .where('crypto_symbol', cryptoSymbol)
    .orderBy('id', 'desc')
    .limit(1)
    .then(callback);
    //console.log('last_checked = ', last_checked);
    return last_checked;
}

var getExternalAddress = function(cryptoAddress){
    var externalAddress = knex
    .select('external_address')
    .from('coin_index')
    .where('crypto_address', cryptoAddress)
    .limit(1);
    //console.log('address pair:', cryptoAddress, externalAddress);
    return externalAddress;
}

var getPendingWithdrawals = function(intLimit){
    var pendingWithdrawals = knex
    .select('external_address')
    .from('blockchain_transactions')
    .where({'pending': 1, 'inbound': 0})
    .whereNull('txid')
    .limit(intLimit)
    .then(callback);
};

var markAsNotPending = function(rowId){
    knex('blockchain_transactions').where('id', '=', rowId)
    .update({
    'pending': false
    })
};

var recordWithdrawalTXID = function(rowId, txid){
    knex('blockchain_transactions').where('id', '=', rowId)
    .update({
    'txid': txid
    })
    

};

var recordLastBlockChecked = function (blockInfoObject){
    console.log('Inserting record into last_block_index');
//    var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": blockHash}
    var knexInsert = knex('last_block_index').insert(blockInfoObject).then(dbCallback)
    .then(function(lastAffectedRow){
        console.log('lastAffectedRow', lastAffectedRow);
        //return true;
        closeDb();});
    return;
    
};

var recordTransaction = function(transactionObject){
    //console.log('Inserting transaction into blockchain_transactions:', transactionObject);
    var knexInsert = knex('blockchain_transactions').insert(transactionObject).then(dbCallback)
    .then(function(output){
        console.log('insertTx output:', output);
    });
    //console.log('KNEX IS A', typeof knexInsert, knexInsert);
    return knexInsert;
};

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
    "getExternalAddress": getExternalAddress,
    "getLastBlockChecked": getLastBlockChecked,
    "recordLastBlockChecked": recordLastBlockChecked,
    "recordNewAddressRelationship": recordNewAddressRelationship,
    "recordTransaction": recordTransaction,
    "database": knex
};


//#TODO: all create functions should return values
//#TODO: #FIXME: closDb at the end of functions is bullshit. fixit.
//#TODO: make this WAY more efficient.
//TODO: ADD TO DOC:
//'mysql -u root -p -e "CREATE USER 'test' IDENTIFIED BY 'test';"
//CREATE DATABASE IF NOT EXISTS roast_coins //do not do this programatically. roast_coins does not need that level of privilege.
//
//#lots of code from https://github.com/felixge/node-mysql
