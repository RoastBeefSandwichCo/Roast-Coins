const withdrawalPollingInterval = 10 // Multiplied by 1000 = poll db every x seconds
var api = require ('../lib/api.js') //atm only provides new block notification (deposits)
var coinDaemons = require('../lib/coin-daemons.js'); //daemon pool and methods
var consoleDebugLevel = 'debug';
var logfileDebugLevel = 'silly';
var winston = require('winston');
var databaseModule = require('../models/database.js'); //all our abstractions //#TODO:FIXME: CATCH DATABASE FAILURE
var withdrawalModule = require('../processes/withdrawals.js');
const logPrefix = 'MAIN> '

function main() {
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
    });
    logger.silly(logPrefix + 'logger', logger);
    logger.info(logPrefix + 'main process starting');
    var database  = new databaseModule.rcDatabase(logger);
    logger.silly(logPrefix + 'database' + database);
    logger.info(logPrefix + 'connecting to database (async)');
    logger.info(logPrefix + 'getting daemon pool');
    var coinDaemonPool = coinDaemons.getDaemonPool(logger);
    logger.silly(logPrefix + coinDaemons);
    logger.info(logPrefix + 'withdrawal manager is API only');
    var withdrawalHandler = new withdrawalModule.withdrawalHandler(coinDaemonPool, database, logger);
    logger.silly(logPrefix + 'withdrawalHandler' + withdrawalHandler)
//    var withdrawalManager = setInterval(handlePendingWithdrawals, withdrawalPollingInterval * 1000);
    var apiServer = new api.api(coinDaemonPool, database, logger, withdrawalHandler);  //controls deposits for now
    apiServer.start();
}

main();

