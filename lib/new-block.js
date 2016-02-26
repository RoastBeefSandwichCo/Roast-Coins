//goal: get unprocessed transactions with minconfirms belonging to addresses we own
//expects CLI invocation from daemon, "node new-block.js <symbol> <new block hash>
//#TODO #FIXME: do not run if already running
var coinDaemonConnector = require('./coin-daemons.js'); //RPC access via node-bitcoin 
var database = require('../models/database.js');
var cryptocurrencies = require('../config/cryptocurrencies.json');
var timestamp = Math.floor(new Date() / 1000) //unix timestamp. This is when we FIRST are notified of the Transactions we now process.
var bestBlockHash = process.argv[3];
const fs = require ('fs');
selfTest = false;
selfTest === true ? cryptoSymbol = "EGC" : cryptoSymbol = process.argv[2].toUpperCase();

function connectToDaemon(cryptoSymbol){
    //process.argv[0] = node, [1] = get-coin-address, [2] = symbol, [3] = externalAccount
    if (cryptocurrencies.hasOwnProperty(cryptoSymbol)) { //if exists
        var coinDaemon = coinDaemonConnector.connectOne(cryptoSymbol); //return a connection to the daemon
        return coinDaemon;
    }
    else{
        console.log('ERROR: BAD SYMBOL; not found in cryptocurrencies.json');
        return 'error';
    }
}

function getInboundTxs(err, objectNewTransactions, stuff1, stuff2) {
    var inboundTransactions = [];
    //console.log("object:", objectNewTransactions, 'stuff1', stuff1, 'stuff2', stuff2);
    if (err){console.log('ERRORRRR!', err);}
    if (objectNewTransactions === null) {
        var lastChecked = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": bestBlockHash};
        database.recordLastBlockChecked(lastChecked);
    return
    }
//    file = require('../example-listsinceblock.json');
//    listExample = file;
    for (each in objectNewTransactions.transactions){
        //console.log(listExample.transactions[each])
        if (objectNewTransactions.transactions[each].category == "receive"){
        //console.log('receive:', each, objectNewTransactions.transactions[each]);
        inboundTransactions.push(objectNewTransactions.transactions[each]);
        }
      }
    console.log('INBOUND!', inboundTransactions, '\nTotal:', inboundTransactions.length);
    ////var x = recordInboundTxs(inboundTransactions); //#TODO: this needs to be a promise or use a callbacks
      //console.log(x);
      //x.then(function(stuff){
    var x = recordInboundTxs(inboundTransactions)
/*    .then(function(arrayPromises){
        var lastChecked = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": bestBlockHash};
        database.recordLastBlockChecked(lastChecked)
        .then(function(stuff){
          closeDb;});
    });
    */
}

function instance_locked (){
    var is_locked;
    fs.access('.lock', fs.F_OK, function(err) {  // one instance!
        if (!err) {
            console.log ('instance_locked: lock exists.');
            is_locked = true;
        }
        else{
            new_lock = fs.writeFile('.lock', 'one instance!\n', function(stuff){
                console.log('new lock:', new_lock);
                console.log('.lock created');
                is_locked = false
            });
        }
    });
    return is_locked;
}

function something(txObject){
    database.getExternalAddress(txObject.address)  //query the db for the associated external address
            .then(function(data){
                if (data.length == 0) {  //empty response! #TODO: something more constructive here.
                    console.log ('YOU GOTTA FUCKING PROBLEM, ADMIN!\ndata:', data, '\nempty db response!');
                }
                else{
                    //console.log('DATA-------------------------------------------------------------------------------------', data);
                    txObject.external_address = data[0].external_address;
                }
                console.log('ATTENTION!=======================================================================================', txObject);
            })
}

function recordInboundTxs(txList) {
//    console.log("TXLIST:",txList);
    var arrayPromises = [];  // promises for each db insertion
    var arrayTxObjects = []  // array of deposits to record
    for (each in txList){
        var deposit = {
            "crypto_address": txList[each].address, //the only blockchain-retrieved data not prefixed with bc_
            "crypto_symbol": cryptoSymbol,
            "finished": 0,  // Finished = 0 = False = Pending.
            "is_inbound": 1,  //0 = false = outbound
            "rc_timestamp": timestamp,  //When the block notification was received by Roast Coins
            "bc_amount": txList[each].amount,
            "bc_blockhash" : txList[each].blockhash,
            "bc_blockindex" : txList[each].blockindex,
            "bc_blocktime" : txList[each].blocktime,
            "bc_time" : txList[each].time,
            "bc_timereceived" : txList[each].timereceived,
            "bc_txid" : txList[each].txid,
            "external_address": null
        };

        something(txList[each]); //iteration while querying worked out REALLY badly so this function keeps data coherent.
/*        database.getExternalAddress(txList[each].address)  //query the db for the associated external address
            .then(function(data){
                //console.log('txlist each 111111111', txList[each]);
                if (data.length == 0) {  //empty response! #TODO: something more constructive here.
                    console.log ('YOU GOTTA FUCKING PROBLEM, ADMIN!\ndata:', data, '\nempty db response!');
                }
                else{
                    console.log('DATA-------------------------------------------------------------------------------------', data);
                    return data[0].external_address;
                }
           //     console.log('ATTENTION!=======================================================================================', deposit);
            })
*/

    }
//        arrayTxObjects.push(deposit);
        /*deposit.external_address = database.getExternalAddress(txList[each].address)  //query the db for the associated external address
        .then(function(data){
            //console.log('txlist each 111111111', txList[each]);
            if (data.length == 0) {  //empty response! #TODO: something more constructive here.
                console.log ('YOU GOTTA FUCKING PROBLEM, ADMIN!\ndata:', data, '\nempty db response!');
            }
            else{
                console.log('DATA-------------------------------------------------------------------------------------', data);
                return data[0].external_address.resolve;
            }
            console.log('ATTENTION!=======================================================================================', deposit);//.external_address);
        });*/
}
//
//                console.log('writeTransaction Object333333333333:', deposit);
//                x = database.recordTransaction(deposit)
//                .then(function(data){console.log('soo uhh... we good?', data)});
        
        
        
        
        
        
        
        
        
        
        
        
/*      
        externalAddress = database.getExternalAddress(txList[each].address)  //query the db for the associated external address
        .then(function(data){
            console.log('txlist each 111111111', txList[each]);
            if (data.length == 0) {  //empty response! #TODO: something more constructive here.
                console.log ('YOU GOTTA FUCKING PROBLEM, ADMIN!\ndata:', data, '\nempty db response!');
            }
            else{
        console.log('EACH!!!====================================================', each);
                console.log('txlist each22222222', txList[each]);
                //console.log(txList[each].address, data);
                //sconsole.log(txList[each].address, data[0].external_address);
                var deposit = {
                "crypto_address": txList[each].address, //the only blockchain-retrieved data not prefixed with bc_
                "crypto_symbol": cryptoSymbol,
                "finished": 0,  // Finished = 0 = False = Pending.
                "is_inbound": 1,  //0 = false = outbound
                "rc_timestamp": timestamp,  //When the block notification was received by Roast Coins
                "bc_amount": txList[each].amount,
                "bc_blockhash" : txList[each].blockhash,
                "bc_blockindex" : txList[each].blockindex,
                "bc_blocktime" : txList[each].blocktime,
                "bc_time" : txList[each].time,
                "bc_timereceived" : txList[each].timereceived,
                "bc_txid" : txList[each].txid,
                "external_address":data[0].external_address
                }

                    //console.log("SUBMITTING:", deposit);
                console.log('writeTransaction Object333333333333:', deposit);
                x = database.recordTransaction(deposit)
                .then(function(data){console.log('soo uhh... we good?', data)});
                //all writes must finish if this module is to closeDb
                
                //.then(function(data){
                //console.log('soo uhh... we good?', data);
                //});
                //console.log("XXXXXXXXXXXXx!", x);
                //return x;
                //arrayWriteTheseTxs.push(deposit);
                //can feed promiseArray to promise.all so that when all promises resolve, block is marked done or if one fails, block is re-done
                //this is obv not best solution when a block may contain thousands or tens of thousands of transactions.
                //#TODO: handle tx insertion failure, logging, retry.
                arrayPromises.push(x); //all writes must finish if this module is to closeDb
            }
        });
    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA',externalAddress)
    //return externalAddress;
    }
    //for (each in arrayPromises){
        console.log("arrayPromises[]", arrayPromises);
    //}
return Promise.all(arrayPromises);












*/





function main(){
    if (process.argv.length < 3){
        console.log('ERROR: BAD INVOCATION');
        return 'error';
    }
    var is_locked = instance_locked();
    console.log("instance locked?"+ is_locked);
    if (is_locked) {
        console.log('One instance only!')
        process.exit();
    }
    else if (!is_locked){
        console.log('NOT LOCKED (well, it is NOW)');
        //process.exit;
    }


    var x = null;
    coinDaemon = connectToDaemon(cryptoSymbol)
    //get last checked block hash from last_block_index
    x = database.getLastBlockChecked(cryptoSymbol, function (rows){  //theoretically, returns a list with one item, the hash of the last block processed
        console.log('rows:', rows);

        if (rows.length == 0) {  //if no last block, use genesis
            console.log('No last block. Using genesis');
            var usingHash = coinDaemon.getBlockHash(0, function(err, genesisHash){
                if (err) { //catch misconfigurations, offline daemon
                    console.log('bad juju with the daemon!')
                    console.log('err:', err);
                }
                else{
                    console.log('listing', cryptoSymbol, 'txs since (genesis) block', genesisHash, 'with', cryptocurrencies[cryptoSymbol].minimumconfirmations, 'confirmations'),
                    coinDaemon.listSinceBlock(genesisHash,cryptocurrencies[cryptoSymbol].minimumconfirmations, getInboundTxs);
                    return  genesisHash;
                }
            })
        }
        else{
        var usingHash = rows[0].block_hash;
        console.log('listing', cryptoSymbol, 'txs since block', usingHash, 'with', cryptocurrencies[cryptoSymbol].minimumconfirmations, 'confirmations'),
        coinDaemon.listSinceBlock(usingHash,cryptocurrencies[cryptoSymbol].minimumconfirmations, getInboundTxs);
        //coinDaemon.listSinceBlock(usingHash, getInboundTxs);
        }
    });
}

main();




//when there's a new block, listsinceblock (last block checked() to now)

//get associated account
//write as deposit to associated account in table_deposits
//


//OUTLINE
//be invoked, meaning new block
//connect to daemon
//  listsinceblock <last-block-checkpoint
//      for each in list
//      db.coin_index.getExternalAddressForThisRecipient
//      db.writeToExternalTxTable
//  update last_block_index
//finished