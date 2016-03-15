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

var closeDb = function(){
    knex.destroy();
}

var dbCallback = function(results, results2, fields){ //suspect first field can be returned value or error. #TODO: parse appropriately
    if (results) {
//        this.logger.silly('========MYSQL RESULTS:', results);
         return results;
     }
    if (results) {
  //      this.logger.silly('========RESULTS2:', results2);
    }
    if (fields) {
    //    this.logger.silly('\n========FIELDS:', fields);
    }
    console.log('nah im here');
    //console.log(results, results2, fields)
    return promise;
}

var createTablesAll = function() {
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

var createTableCoinIndex = function(){
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

var createTableExternalTransactions = function() {  //records blockchain transaction info and associated external address
    var x = knex.schema.createTableIfNotExists('blockchain_transactions', function (table) {
        table.increments();
        table.string('bc_address');
        table.string('crypto_symbol');
        table.string('external_address');
        table.boolean('finished');  // Finished = 0 = False = Pending.
        table.boolean('is_inbound');  //0 = false = outbound
        table.integer('rc_timestamp'); //When the block notification was received by Roast Coins
        table.string('bc_blockhash'); /*fields by rpc-reported name from blockchain client*/
        table.decimal('bc_amount');
        table.integer('bc_blockindex');
        table.integer('bc_blocktime');
        table.string('bc_commentTo');
        table.string('bc_dest');
//        table.string('bc_origin'); unnecessary. for deposits, might be multiple. for withdrawals, is bc_address.
        table.integer('bc_time');
        table.integer('bc_timereceived');
        table.string('bc_txid');
    }).catch(function(error){
        console.log('error in knex table creation: blockchain_transactions');
        console.log(error);
        })
    return x;
    /*.then(function(result){
        //console.log('creationResult:', result);
        return result;
    });*/
    //varchar 255 string external_address, bool? direction, bool? finished(edited)
}

var createTableLastBlockIndex = function(){ //tracks the last block for which we have processed all transactions #TODO: what happens when they're
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

//#TODO: detect cli invocation for easy table creation
if (process.argv.length > 2) {
    if (process.argv[2] == 'createTables') {
        console.log('CLI invocation. Creating address table.');
        createTablesAll();
    }
}



//#TODO: all create functions should return values
//#TODO: #FIXME: closDb at the end of functions is bullshit. fixit.
//#TODO: make this WAY more efficient.
