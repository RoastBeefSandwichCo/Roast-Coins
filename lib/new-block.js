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
const logPrefix = "new-block: ";
selfTest = false;
//cli for testing only
//var bestBlockHash = process.argv[3];
//selfTest === true ? cryptoSymbol = "EGC" : cryptoSymbol = process.argv[2].toUpperCase();
var bestBlockHash = null;

function processBlock(cryptoSymbol, bestBlockHash, coinDaemonPool, database, logger){
    this.database = database;
    this.bestBlockHash = bestBlockHash;//received from api call. will be re-set with block data
    this.coinDaemonPool = coinDaemonPool;
    this.logger = logger
    this.cryptoSymbol = cryptoSymbol;
    var x = null;

    function getInboundTxs(err, objectNewTransactions, stuff1, stuff2) {
        bestBlockHash = objectNewTransactions.lastblock; // overwrite info received by api call (not trustworthy)
        var inboundTransactions = [];
        //logger.debug(logPrefix + 'new-block: getInboundTxs:" + objectNewTransactions);
        if (err){console.log('ERRORRRR!', err, objectNewTransactions, stuff1, stuff2);}
        if (!objectNewTransactions || objectNewTransactions.transactions.length < 1){//check to make sure transactions exists before evaluating
            var lastChecked = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": bestBlockHash};
            database.recordLastBlockChecked(lastChecked);
	}else{
        console.log(objectNewTransactions);
        for (each in objectNewTransactions.transactions){
            if (objectNewTransactions.transactions[each].category == "receive"){
            inboundTransactions.push(objectNewTransactions.transactions[each]);
            }
          }
        }
        logger.verbose('INBOUND!' + inboundTransactions + '\nTotal:' + inboundTransactions.length);
    
        var x = prepareInboundTxs(inboundTransactions)
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

    function recordIncomingTransactions (bcAccount, objectDeposit){
        console.log(logPrefix + 'something: account:', bcAccount)
        if (objectDeposit.confirmations < coinDaemonPool[cryptoSymbol].minimumconfirmations){
            logger.verbose(logPrefix + 'something: not enough confirmations');
            return;
        }
        //reject duplicates! #TODO
        database.getExternalAddress(bcAccount)  //query the db for the associated external address
        .then(function(externalAddressField){
//it occurs to me that this isn't necessary. So what if you can't find a correlated external address? still record the deposit.
            if (!externalAddressField || externalAddressField.length == 0){//.length == 0) {  //empty response! #TODO: something more constructive here.
               logger.info('NO EXTERNAL ADDRESS FOUND!.. continuing anyway.');
              var  addressField=[{"external_address": "NULL"}]; //fake it for the next step!
            }
            objectDeposit.external_address = addressField[0].external_address;
            database.recordTransaction(objectDeposit)
            .then(function(data){
                logger.debug('soo uhh... we good?', data);
                });
            console.log('ATTENTION!=======================================================================================', objectDeposit);
        })
    }


    function prepareInboundTxs(txList) {
        var arrayTxObjects = []  // array of deposits to record
        for (each in txList){
            var deposit = {
                "bc_address": txList[each].address, //the only blockchain-retrieved data not prefixed with bc_
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
            recordIncomingTransactions(txList[each].address, deposit); //iteration while querying worked out REALLY badly so this function keeps data coherent.
        }//implement a promise here to fix this race condition. mark block checked only after other inserts.
        var lastChecked = {"timestamp": timestamp, "crypto_symbol": cryptoSymbol, "block_hash": bestBlockHash};
        database.recordLastBlockChecked(lastChecked);

    }

    function writeTestWithdrawal(txList) { //yeah this doesn't really belong here at all.
        var arrayTxObjects = []  // array of deposits to record
        for (each in txList){
            var deposit = {
                "bc_address": "BMShVhSFimfHVv4zQbRm58XYN6wJkYdFdx", //the only blockchain-retrieved data not prefixed with bc_
                "crypto_symbol": "BERN",
                "finished": 0,  // Finished = 0 = False = Pending.
                "is_inbound": 0,  //0 = false = outbound
//                "rc_timestamp": null,  //When the block notification was received by Roast Coins
                "bc_amount": 0.00000001,
//                "bc_blockhash" : txList[each].blockhash,
//                "bc_blockindex" : txList[each].blockindex,
//                "bc_blocktime" : txList[each].blocktime,
                "bc_dest" : "B9xqWsf7PiNdhPo6fCqUCAphzYbcG6j7u6", 
//                "bc_time" : txList[each].time,
//                "bc_timereceived" : txList[each].timereceived,
//                "bc_txid" : txList[each].txid,
                "external_address": "free booty!"
            };
            something(txList[each].address, deposit); //iteration while querying worked out REALLY badly so this function keeps data coherent.
        }
    }

    logger.verbose(logPrefix + 'started');
    coinDaemon = coinDaemonPool[cryptoSymbol];
    logger.debug(logPrefix + 'cryptoSymbol: ' + cryptoSymbol.toString());
    logger.debug(logPrefix + 'coinDaemon: ' + coinDaemon);
    //get last checked block hash from last_block_index
    x = this.database.getLastBlockChecked(cryptoSymbol, function (rows){  //theoretically, returns a list with one item, the hash of the last block processed
        logger.debug(logPrefix + 'Rows:' , rows);
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
            });
        }
        else{
        var usingHash = rows[0].block_hash;
        console.log('listing', cryptoSymbol, 'txs since block', usingHash, 'with', cryptocurrencies[cryptoSymbol].minimumconfirmations, 'confirmations'),
        coinDaemon.listSinceBlock(usingHash,cryptocurrencies[cryptoSymbol].minimumconfirmations, getInboundTxs);
//        coinDaemon.listSinceBlock(usingHash, getInboundTxs);
        
        //coinDaemon.listSinceBlock(usingHash, getInboundTxs);
        }
    });
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
