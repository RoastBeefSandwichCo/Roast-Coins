"use strict";
//var database = require('../models/database.js');
//var coinDaemons = require('./coin-daemons.js');
var coinDaemonPool = null;
const dbSelectLimit = 100;
const logPrefix = 'get-withdrawals> ';

function withdrawalHandler(coinDaemonPool, database, logger) {
    this.database = database;
    this.coinDaemonPool = coinDaemonPool;
    this.logger = logger;

    var markAsDone = function(rowId, txId){  //the authoritative "finished" marker, write the txid    
        if (txid != somekindoferror) {
            logger.info(rowId, txid);
            database.recordWithdrawalTXID(rowId, txid); 
        }else{
            logger.info(logPrefix + 'something went very wrong');
            logger.info(txid);
       } 
    }
    
    var doWithdrawal = function(amount, commentTo, cryptoSymbol, destination, rowId){

        coinDaemonPool[cryptoSymbol].sendToAddress(destination, amount, function(err, txid, resHeaders){
//console.log(logPrefix + 'errors:' + err + '\nresHeaders' + resHeaders + '\ntxid:' + txid);
//                amount = Number (amount);
                logger.debug(destination, amount);
                logger.debug(logPrefix + 'errors:' + err + '\nresHeaders' + resHeaders + '\ntxid:' + txid);
                if (txid != undefined){
                    console.log(logPrefix, 'Transaction sent! TXID:',txid);
                    markAsDone(rowId, txid);
                    return true;
                }else{
                    logger.error(logPrefix, 'sendTx: TRANSACTION FAILED!');// shit ten bricks
                    return false;
                }
        });
    }

    this.selectPendingWithdrawals = function(){ //read database, send transactions, mark done
        database.getPendingWithdrawals(dbSelectLimit)
        .then(function(pendingWithdrawals, callback){ //grab dbSelectLimit number of pending withdrawals
            logger.debug(logPrefix + 'pendingWithdrawals: ' + pendingWithdrawals);
            for (var each in pendingWithdrawals){
                logger.debug(logPrefix + 'each: ' , pendingWithdrawals[each]);
                var rowId = pendingWithdrawals[each].id;
                logger.debug (logPrefix + 'marking ' + rowId + ' as not pending')
                var catchMarkFailure = database.markAsNotPending(rowId); //prevent double-processing //#TODO: catch fail
                logger.warn(logPrefix + 'you need to check catchMarkFailure!');
                var txid = doWithdrawal(pendingWithdrawals[each].bc_amount, pendingWithdrawals[each].bc_commentTo, pendingWithdrawals[each].crypto_symbol, pendingWithdrawals[each].bc_dest, rowId);// #FIXME: ADD THESE FIELDS!
                }
            }
        );
    }

}
module.exports ={
    "withdrawalHandler": withdrawalHandler
}
