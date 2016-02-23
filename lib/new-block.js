//goal: get unprocessed transactions with minconfirms belonging to addresses we own
//expects CLI invocation from daemon, "node new-block.js <symbol> <new block hash>

var coinDaemonConnector = require('./coin-daemons.js'); //RPC access via node-bitcoin 
var database = require('../models/database.js');
var cryptocurrencies = require('../config/cryptocurrencies.json');
selfTest = true;
var timestamp = Math.floor(new Date() / 1000) //unix timestamp. This is when we FIRST are notified of the Transactions we now process.

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

function getInboundTxs(objectNewTransactions) {
    var inboundTransactions = [];
    file = require('../example-listsinceblock.json');
    listExample = file;
      for (each in listExample.transactions){
        //console.log(listExample.transactions[each])
        if (listExample.transactions[each].category == "receive"){
        //console.log('receive:', each, listExample.transactions[each]);
        inboundTransactions.push(listExample.transactions[each]);
        }
      }
      console.log('INBOUND!', inboundTransactions, '\nTotal:', inboundTransactions.length);
      recordInboundTxs(inboundTransactions);
      return inboundTransactions;
}

function recordInboundTxs(txList) {
    for (each in txList){
      externalAddress = database.getExternalAddress(txList[each].address)  //query the db for the associated external address
      .then(function(data){
        if (data.length == 0) {  //empty response! #TODO: something more constructive here.
            console.log ('YOU GOTTA FUCKING PROBLEM, ADMIN!\ndata:', data, '\nempty db response!');
        }
        else{
            console.log(txList[each].address, data);
            console.log(txList[each].address, data[0].external_address);
            var deposit = { //bc_ prefix indicates fields read from the blockchain. This differentiation clarifies timestamps.
                "crypto_address": txList[each].address, //the only blockchain-retrieved data not prefixed with bc_
                "crypto_symbol": cryptoSymbol,
                "external_address": data[0].external_address,
                "finished": 0,  // Finished = 0 = False = Pending.
                "is_inbound": 1,  //0 = false = outbound
                "timestamp": timestamp,
                "bc_blockhash" : txList[each].blockhash,
                "bc_blockindex" : txList[each].blockindex,
                "bc_blocktime" : txList[each].blocktime,
                "bc_time" : txList[each].time,
                "bc_timereceived" : txList[each].timereceived,
                "bc_txid" : txList[each].txid
                };
            console.log('writeTransaction Object:', deposit);
            database.recordTransaction(deposit)
            .then(function(data){
            console.log('soo uhh... we good?', data);
            });
        }
      });
    }
}

function main(){
/* comment block during tx-read testing
    if (process.argv.length < 3){
        console.log('ERROR: BAD INVOCATION');
        return 'error';
    }
*/
    var x = null;
    selfTest === true ? cryptoSymbol = "EGC" : cryptoSymbol = process.argv[2];
    coinDaemon = connectToDaemon(cryptoSymbol)
    //get last checked block hash from last_block_index
    x = database.getLastBlockChecked(cryptoSymbol, function (rows){  //theoretically, returns a list with one item, the hash of the last block processed
        console.log('rows:', rows);
        var usingHash = rows;
        if (rows.length == 0) {  //if no last block, use genesis
            console.log('No last block. Using genesis');
            usingHash = coinDaemon.getBlockHash(0, function(err, genesisHash){
                if (err) { //catch misconfigurations, offline daemon
                    console.log('bad juju with the daemon!')
                    console.log('err:', err);
                }
                else{
                    console.log('listing', cryptoSymbol, 'txs since (genesis) block', genesisHash, 'with', cryptocurrencies[cryptoSymbol].minimumconfirmations, 'confirmations'),
                    coinDaemon.listSinceBlock([genesisHash,cryptocurrencies[cryptoSymbol].minimumconfirmations], getInboundTxs);
                    return  genesisHash;
                }
            })
        }
        else{
        console.log('listing', cryptoSymbol, 'txs since block', usingHash, 'with', cryptocurrencies[cryptoSymbol].minimumconfirmations, 'confirmations'),
        coinDaemon.listSinceBlock([usingHash,cryptocurrencies[cryptoSymbol].minimumconfirmations], getInboundTxs);
        }

    });
        
    console.log('LASTBLOCKHASH', x);
//      externalAddress = db.getExternalAddress(cryptoAddress);
//      db.writeToExternalTxTable
/*    writeTransaction = {
        "blockhash" : each.blockhash,
        "blockindex" : each.blockindex,
        "blocktime" : each.blocktime,
        "txid" : each.txid,
        "time" : each.time,
        "timereceived" : each.timereceived,
        "timestamp": timestamp,
        "crypto_symbol": cryptoSymbol,
        "crypto_address": each.address,
        "external_address": externalAddress,
        "direction": 0,
        "finished": 1
    };
*/
    //}).catch(function(error){}
    //}
//  update last_block_index
// newLastBlock = coinDaemon.getbestblockhash();
//finished
}


if (selfTest === true) {
    main();
}


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