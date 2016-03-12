"use strict";

var database = require('../models/database.js');
pendingWithdrawals = database.getPendingWithdrawals(100);//select 100 where incoming = false, pending = true, txid = null
for (each in pendingWithdrawals){
    database.markAsNotPending(rowId);
//  sendtoaddress fromaddress amount comment1 comment2 comment3
    recordWithdrawalTXID(rowId, txid);
}