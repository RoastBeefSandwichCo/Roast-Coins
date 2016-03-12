"use strict";

var database = require('../models/database.js');
var coinDaemons = require('./coin-daemons.js');
const dbSelectLimit = 100;

var handlePendingWithdrawals = function(){
    database.getPendingWithdrawals(dbSelectLimit);//select 100 where incoming = false, pending = true, txid = null
    for (each in pendingWithdrawals){
        database.markAsNotPending(rowId);
        sendTx(destination, amount, commentTo);
        recordWithdrawalTXID(rowId, txid);
    }
}

function sendTx(dest, amt, comm){
    coinDaemons[cryptoSymbol].sendToAddress(destination, amount, commentTo), function(err, txid, resHeaders){
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