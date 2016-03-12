"use strict";

var database = require('../models/database.js');
//var coinDaemons = require('./coin-daemons.js');
var coinDaemonPool = null;
const dbSelectLimit = 100;

function handlePendingWithdrawals (coinDaemonPool){ //read database, send transactions, mark done
    this.coinDaemonPool = coinDaemonPool;
    database.getPendingWithdrawals(dbSelectLimit); //grab dbSelectLimit number of pending withdrawals
    for (each in pendingWithdrawals){
        database.markAsNotPending(rowId); //prevent double-processing
        txid = sendTx(destination, amount, commentTo);
        if (txid != somekindoferror) {
            recordWithdrawalTXID(rowId, txid); //the true "finished" marker, write the txid    
        }
    }
}

function sendTx(dest, amt, comm){
    coinDaemonPool[cryptoSymbol].sendToAddress(destination, amount, commentTo), function(err, txid, resHeaders){
            console.log(logPrefix, 'errors:', err, '\nresHeaders', resHeaders, '\ntxid:', txid);
            if (txid != undefined ){
                console.log(logPrefix, 'Transaction sent! TXID:',txid);
                //fnClearPending(withdrawalObj.id);//should not be done here. Handle in process-withdrawal
                //return thiswithdrawal.id;
				fnClearPending(withdrawalObj.id);
				return true;
            }else{
                console.log(logPrefix, 'process-withdrawal>sendTx>Transaction failed!!');// not, shit ten bricks
                return false;
            }
        };
}

module.exports ={
    "handlePendingWithdrawals": handlePendingWithdrawals
}