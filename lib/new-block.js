//#FIXME: seems to not be documenting last block checked
//goal: get unprocessed transactions with minconfirms belonging to addresses we own
//expects CLI invocation from daemon, "node new-block.js <symbol> <new block hash>
//var coinDaemonConnector = require('./coin-daemons.js'); //RPC access via node-bitcoin 
var coinDaemonConnector = null; //pool supplied when called as export
//var database = require('../models/database.js');
var database = null; //pool supplied when called as export
var cryptocurrencies = require('../config/cryptocurrencies.json');
var timestamp = Math.floor(new Date() / 1000) //unix timestamp. This is when we FIRST are notified of the Transactions we now process.
const fs = require ('fs');
const logPrefix = "newblock: ";
selfTest = false;
//cli for testing only
//var bestBlockHash = process.argv[3];
//selfTest === true ? cryptoSymbol = "EGC" : cryptoSymbol = process.argv[2].toUpperCase();
var bestBlockHash = null;

function processBlock(cryptoSymbol, bestBlockHash, coinDaemonPool, database, logger){
    this.database = database;
    this.bestBlockHash = bestBlockHash;
    this.coinDaemonPool = coinDaemonPool;
    this.logger = logger
    this.cryptoSymbol = cryptoSymbol;
    var x = null;

    function connectToDaemon (cryptoSymbol){
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
    //    console.log(logPrefix + "getInboundTransactions: objectNewTransactions: " + objectNewTransactions[0],toString());
        if (err){console.log('ERRORRRR!', err);}
        if (objectNewTransactions === null) {
            var lastChecked = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": bestBlockHash};
            database.recordLastBlockChecked(lastChecked);
        return
        }else{
        console.log(objectNewTransactions);
        for (each in objectNewTransactions.transactions){
            //console.log(listExample.transactions[each])
            if (objectNewTransactions.transactions[each].category == "receive"){
            //console.log('receive:', each, objectNewTransactions.transactions[each]);
            inboundTransactions.push(objectNewTransactions.transactions[each]);
            }
          }
        }
        console.log('INBOUND!', inboundTransactions, '\nTotal:', inboundTransactions.length);
    
        var x = recordInboundTxs(inboundTransactions) // remove last 2 vars when you fix the obj
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

    function something (bcAccount, objectDeposit){
        console.log("account:", bcAccount)
        database.getExternalAddress(bcAccount)  //query the db for the associated external address
        .then(function(addressField){
            if (addressField.length == 0) {  //empty response! #TODO: something more constructive here.
                console.log ('YOU GOTTA FUCKING PROBLEM, ADMIN!\ndata:', addressField, '\nempty db response!');
            }
            else{
            //    console.log('DATA-------------------------------------------------------------------------------------', addressField);
                objectDeposit.external_address = addressField[0].external_address;
                database.recordTransaction(objectDeposit)
                .then(function(data){
                    console.log('soo uhh... we good?', data);
    
            var lastChecked = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": bestBlockHash};//testing
                    database.recordLastBlockChecked(lastChecked);
    
                });
            }
            console.log('ATTENTION!=======================================================================================', objectDeposit);
        })
    }


    function recordInboundTxs(txList) {
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
            something(txList[each].address, deposit); //iteration while querying worked out REALLY badly so this function keeps data coherent.
        }
    }

    logger.verbose(logPrefix + 'started');
    coinDaemon = coinDaemonPool[cryptoSymbol];
    logger.debug(logPrefix + 'cryptoSymbol: ' + cryptoSymbol.toString());
    logger.debug(logPrefix + 'coinDaemon: ' + coinDaemon);
    //get last checked block hash from last_block_index
    x = database.getLastBlockChecked(cryptoSymbol, function (rows){  //theoretically, returns a list with one item, the hash of the last block processed
        logger.debug(logPrefix + 'rows:' , rows);
        if (rows.length == 0) {  //if no last block, use genesis
            logger.info(logPrefix + 'No last block. Using genesis');
            var usingHash = coinDaemon.getBlockHash(0, function(err, genesisHash){
                if (err) { //catch misconfigurations, offline daemon
                    logger.error(logPrefix + 'bad juju with the daemon!')
                }
                else{
                    logger.debug(logPrefix + 'listing', cryptoSymbol, 'txs since (genesis) block', genesisHash, 'with', cryptocurrencies[cryptoSymbol].minimumconfirmations, 'confirmations'),
                    coinDaemon.listSinceBlock(genesisHash,cryptocurrencies[cryptoSymbol].minimumconfirmations, getInboundTxs);
                    return  genesisHash;
                }
            })
        }
        else{
        var usingHash = rows[0].block_hash;
        console.log('listing', cryptoSymbol, 'txs since block', usingHash, 'with', cryptocurrencies[cryptoSymbol].minimumconfirmations, 'confirmations'),
        coinDaemon.listSinceBlock(usingHash,cryptocurrencies[cryptoSymbol].minimumconfirmations, getInboundTxs(cryptoSymbol, bestBlockHash));
        //coinDaemon.listSinceBlock(usingHash, getInboundTxs);
        }
    });

//cli for testing only
/*    if (process.argv.length < 3){
        console.log('ERROR: BAD INVOCATION');
        return 'error';
    }
*/
//#TODO#FIXME: lock for coin, not globally.
/*    var is_locked = instance_locked();
    console.log("instance locked?"+ is_locked);
    if (is_locked) {
        console.log('One instance only!')
        process.exit();
    }
    else if (!is_locked){
        console.log('NOT LOCKED (well, it is NOW)');
        //process.exit;
    }*/
}

//main();

module.exports = {
    "newBlock": processBlock
}
//OUTLINE
//1) invoked- notification of new block with coinSymbol and blockHash
//2) connect to daemon
//3)  listsinceblock <last-block-checkpoint>  //get all transactions since last check
//4)      for each in listOfTransactions
//4a)      db.coin_index.getExternalAddressForThisRecipient  //get gateway/exchange account associated with blockchain address
//4b)      db.writeToExternalTxTable  //record transaction
//5)  update last_block_index  //record this block was processed
//finished
