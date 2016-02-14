var coinDaemonConnector = require('./coin-daemons.js'); //hopefully returns two methods
//access to an array of node-bitcoin clients using cryptocurrencies.json and a single-client connector
var config = require('../config/config.json');
var database = require('../models/database.js');

//should probably reduce that to only the new coin.

function cryptoSymbolCheck (symbol){
    if (typeof symbol === 'undefined') { // not called by another module or bad call
        if (process.argv[2] ==='undefined') { // and no CLI arg or bad CLI invocation
            console.log('NO SYMBOL!');
            return 'NO SYMBOL';
        }
        else { //if present
            return process.argv[2]; // use CLI arg
        }
    }
    else { // use symbol passed by module call
        return symbol;
    }
}

getAddress = function(symbol, externalAddress){
    if (typeof externalAddress === 'undefined') {
        externalAddress = 'NULL';
    }
    var cryptoSymbol = cryptoSymbolCheck(symbol);
    var timestamp = Math.floor(new Date() / 1000) //unix timestamp
    var coinDaemon = coinDaemonConnector.connectOne(cryptoSymbol); //node-bitcoin client
    var cryptoAddress = coinDaemon.getNewAddress; //#FIXME: find api call in node-bitcoin documentation
    result = database.recordNewAddress(cryptoAddress, cryptoSymbol, externalAddress, timestamp);
    return result;
}

module.exports = {
    "getAddress": getAddress
}


/*
#TODO: validate script invocation "usage: get-coin-address <coin symbol>"
#TODO: arg for num of addresses to generate
*/