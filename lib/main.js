
var database = require('./models/database.js').db_test; //all our abstractions
var coinDaemons = require('./lib/coin-daemons.js'); //daemon pool and methods
var api = require ('./lib/api.js') //atm only provides new block notification (deposits)
const withdrawalPollingInterval = 10 // Multiplied by 1000 = poll db every x seconds

function main() {
    var coinDaemonPool = coinDaemons.daemonPool();
    var withdrawalManager = setInterval(handlePendingWithdrawals, withdrawalPollingInterval * 1000);
    var depositManager = api.start(database, coinDaemonPool);
}

main();

