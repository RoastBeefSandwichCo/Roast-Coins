const withdrawalPollingInterval = 10 // Multiplied by 1000 = poll db every x seconds

var api = require ('../lib/api.js') //atm only provides new block notification (deposits)
var coinDaemons = require('../lib/coin-daemons.js'); //daemon pool and methods
var consoleDebugLevel = 'debug';
var logfileDebugLevel = 'debug';
var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: consoleDebugLevel,
            colorize: true
        }),
        new winston.transports.File ({
            filename: 'rc_debug.log',
            level: logfileDebugLevel,
            json: true
        })
    ]
})

var database = require('../models/database.js').main(logger); //all our abstractions

function main() {
    logger.log('info', 'main started');
    logger.log('verbose', 'getting pool');
    var coinDaemonPool = coinDaemons.getDaemonPool(logger);
//    logger.log('verbose', 'starting withdrawal manager, interval: %i', withdrawalPollingInterval);
    logger.log('verbose', 'NOT starting withdrawal manager, interval: %j sec', withdrawalPollingInterval);
//    var withdrawalManager = setInterval(handlePendingWithdrawals, withdrawalPollingInterval * 1000);
    logger.log('verbose', 'starting deposit manager (api), interval: '+ '');
    var depositManager = api.start(database, coinDaemonPool, logger);
}

main();

