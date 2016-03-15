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

    this.selectPendingWithdrawals = function(){ //read database, send transactions, mark done
        database.getPendingWithdrawals(dbSelectLimit)
        .then(function(pendingWithdrawals){ //grab dbSelectLimit number of pending withdrawals
            logger.debug(logPrefix + 'pendingWithdrawals: ' + pendingWithdrawals);
            for (each in pendingWithdrawals){
                rowId = pendingWithdrawals[each].id;
                logger.debug (logPrefix + 'marking ' + rowId + 'as not pending')
                catchMarkFailure = database.markAsNotPending(rowId); //prevent double-processing //#TODO: catch fail
                logger.warn(logPrefix + 'you need to check catchMarkFailure!');
                txid = this.doWithdrawal(rowId, pendingWithdrawals[each].bc_dest, pendingWithdrawals[each].bc_amount, pendingWithdrawals[each].bc_commentTo);// #FIXME: ADD THESE FIELDS!
                }
            }
        );
    }

    this.markAsDone = function(rowId, txId){  //the authoritative "finished" marker, write the txid    
        if (txid != somekindoferror) {
            database.recordWithdrawalTXID(rowId, txid); 
        }
    }
    
    this.doWithdrawal = function(rowId, destination, amount, commentTo){
        coinDaemonPool[cryptoSymbol].sendToAddress(destination, amount, commentTo), function(err, txid, resHeaders){
                console.log(logPrefix, 'errors:', err, '\nresHeaders', resHeaders, '\ntxid:', txid);
                if (txid != undefined){
                    console.log(logPrefix, 'Transaction sent! TXID:',txid);
                    this.markAsDone(rowId, txid);
                    return true;
                }else{
                    logger.error(logPrefix, 'sendTx: TRANSACTION FAILED!');// shit ten bricks
                    return false;
                }
        };
    }
}
module.exports ={
    "handlePendingWithdrawals": handlePendingWithdrawals
}