var coinDaemonConnector = require('./coin-daemons.js'); //hopefully returns two methods
//access to an array of node-bitcoin clients using cryptocurrencies.json and a single-client connector
var config = require('../config/config.json');
var database = require('../models/database.js');
var cryptocurrencies = require('../config/cryptocurrencies.json');

function invocationCheck(symbol) {
    if (typeof symbol === 'undefined') { // is CLI invocation or bad call
        //[0] = node, [1] = get-coin-address, [2] = symbol, [3] = externalAccount
        if (process.argv.length < 4) { //missing arg!
            console.error('usage: get-coin-address <coin symbol> <externalAccount>');
            console.error('where externalAccount will be paired with new coin address');
            return 'error';
        }
        else{
            if (cryptocurrencies.hasOwnProperty(process.argv[2])) {
                return process.argv[2]; // 
            }
            else{
                console.error('Symbol ' + process.argv[2] + ' is not in cryptocurrencies.json');
                return 'error';
            }
        }
    }
    else{
        return symbol; // good call by another module
    }
}


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

getAddress = function(symbol, externalAccount){
    if (typeof externalAccount === 'undefined') {
        externalAccount = 'NULL';
    }
    var cryptoSymbol = cryptoSymbolCheck(symbol);
    var timestamp = Math.floor(new Date() / 1000) //unix timestamp
    var coinDaemon = coinDaemonConnector.connectOne(cryptoSymbol); //node-bitcoin client
    var cryptoAddress = coinDaemon.getNewAddress; //#FIXME: find api call in node-bitcoin documentation
    result = database.recordNewAddressRelationship(cryptoAddress, cryptoSymbol, externalAccount, timestamp);
    return result;
}

module.exports = {
    "getAddress": getAddress()
}


/*
#TODO: arg for num of addresses to generate
*/