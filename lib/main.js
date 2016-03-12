
var database = require('./models/database.js'); //all our abstractions
var coinDaemons = require('./lib/coin-daemons.js'); //daemon pool and methods
var api = require ('./lib/api.js') //atm only provides new block notification (deposits)
const withdrawalPollingInterval = 10 //poll db every x seconds (this value * 1000)


coinDaemonPool = coinDaemons.daemonPool();
withdrawalManager = setInterval(handlePendingWithdrawals, withdrawalPollingInterval * 1000);
depositManager = api.start();
