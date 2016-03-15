"use strict";
//#TODO: remove table creation funcs
var dbProperties = require('../config/config.json');
//require('mysql');
/*if (dbProperties.database.client.toLowerCase() === 'postgresql'){
require ('pg');
*/
var logPrefix = 'database: ';
var knex = null;
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
//console.log(knex);
//#FIXME: frikkin thing.. winston, output, fix.

function rcDatabase(logger) { 
    this.logger = logger;
    this.database = knex;
    //console.log(knex);

    this.closeDb = function(){
        knex.destroy();
    }
    
//logger.debug('CLOSEDB?'+ closeDb); okay so methods are there.
    this.dbCallback = function(results, results2, fields){ //suspect first field can be returned value or error. #TODO: parse appropriately
        if (results) {
            logger.debug(logPrefix + '========MYSQL RESULTS:' + results);
             return results;
         }
        if (results) {
            logger.debug(logPrefix + '========RESULTS2:' + results2);
        }
        if (fields) {
            logger.debug('\n' + logPrefix + '========FIELDS:' + fields);
        }
        console.log('nah im here');
        console.log(results, results2, fields)
        return promise;
    }
    
    this.createTablesAll = function() {
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
    
    this.createTableCoinIndex = function(){
        var x = knex.schema.createTableIfNotExists('coin_index', function (table) {
            table.increments();
            table.integer('timestamp');
            table.string('crypto_symbol');
            table.string('bc_address');
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
    
    this.createTableLastBlockIndex = function(){ //tracks the last block for which we have processed all transactions #TODO: what happens when they're
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
    }
    
   this.getLastBlockChecked = function(cryptoSymbol, callback) {
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
    
    this.getExternalAddress = function(cryptoAddress){
        var externalAddress = knex
        .select('external_address')
        .from('coin_index')
        .where('bc_address', cryptoAddress)
        .limit(1);
        //console.log('address pair:', cryptoAddress, externalAddress);
        return externalAddress;
    }
    
    this.getPendingWithdrawals = function(intLimit, callback){
        var pendingWithdrawals = knex
        .select('id', 'external_address', 'crypto_symbol', 'bc_dest', 'bc_amount', 'bc_commentTo')
        .from('blockchain_transactions')
        .where({'is_finished': 0, 'is_inbound': 0})
        .whereNull('bc_txid')
        .limit(intLimit)
        //.then(callback);//try with promise first
        return pendingWithdrawals;
    };
    
    this.markAsNotPending = function(rowId){
        knex('blockchain_transactions').where('id', rowId)
        .update({
        'is_finished': false
        })
    };
    
    this.recordWithdrawalTXID = function(rowId, txid){
        knex('blockchain_transactions').where('id', rowId)
        .update({
        'txid': txid
        })
        
    
    };
    
    this.recordLastBlockChecked = function (blockInfoObject){
        console.log('Inserting record into last_block_index');
    //    var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": blockHash}
        var knexInsert = knex('last_block_index').insert(blockInfoObject).then(this.dbCallback)
        .then(function(lastAffectedRow){
            console.log('lastAffectedRow', lastAffectedRow);
            //return true;
//            closeDb();
            });
        return;
        
    };
    
    this.recordTransaction = function(transactionObject){
        //console.log('Inserting transaction into blockchain_transactions:', transactionObject);
        var knexInsert = knex('blockchain_transactions').insert(transactionObject).then(this.dbCallback)
        .then(function(output){
            console.log('insertTx output:', output);
        });
        //console.log('KNEX IS A', typeof knexInsert, knexInsert);
        return knexInsert;
    };
    
    this.recordNewAddressRelationship = function( cryptoAddress, cryptoSymbol, externalAccount, timestamp, callback){
    //comment out, test, remove    var post =  {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "bc_address": cryptoAddress, "external_address": externalAccount};
      //  var db = mysqlConnection();
        var knexString = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "bc_address": cryptoAddress, "external_address": externalAccount}
        var knexInsert = knex('coin_index').insert(knexString).then(dbCallback)
        .then(function(lastAffectedRow){
            console.log('lastAffectedRow', lastAffectedRow);
            //return true;
            closeDb();});
        console.log('Inserting record into coin_index');
        return;
    };
}

//#TODO: detect cli invocation for easy table creation
if (process.argv.length > 2) {
    if (process.argv[2] == 'createTables') {
        console.log('CLI invocation. Creating address table.');
        createTablesAll();
    }
}


module.exports = {
/*    "closeDb": closeDb,
    "getExternalAddress": getExternalAddress,
    "getLastBlockChecked": getLastBlockChecked,
    "recordLastBlockChecked": recordLastBlockChecked,
    "recordNewAddressRelationship": recordNewAddressRelationship,
    "recordTransaction": recordTransaction,
//    "database": knexDb(),
    "main": main*/
    "rcDatabase": rcDatabase
};


//#TODO: all create functions should return values
//#TODO: #FIXME: closDb at the end of functions is bullshit. fixit.
//#TODO: make this WAY more efficient.
