var coinDaemonConnector = require('./coin-daemons.js'); //hopefully returns two methods
//access to an array of node-bitcoin clients using cryptocurrencies.json and a single-client connector
var config = require('../config/config.json');
var database = require('../models/database.js');
var cryptocurrencies = require('../config/cryptocurrencies.json');

function invocationCheck(symbol) {
    console.log('invocationCheck: symbol:', symbol, '\TYPEOF:', typeof symbol);
    if (typeof symbol === 'undefined') { // is CLI invocation or bad call
        //[0] = node, [1] = get-coin-address, [2] = symbol, [3] = externalAccount
        if (process.argv.length < 4) { //missing arg!
            console.error('usage: get-coin-address <coin symbol> <externalAccount>');
            console.error('where externalAccount will be paired with new coin address');
            return 'error';
        }
        else{
            if (cryptocurrencies.hasOwnProperty(process.argv[2])) {
                console.log ('assigning symbol', process.argv[2]);
                return process.argv[2]; // 
            }
            else{
                console.error('Symbol ' + process.argv[2] + ' is not in cryptocurrencies.json');
                return 'error';
            }
        }
    }
    else{
        console.log ('assigning symbol', symbol);
        return symbol; // good call by another module
    }
}


var getAddress = function(symbol, externalAccount){
    if (typeof externalAccount === undefined) {
        externalAccount = 'NULL';
    }
    var cryptoSymbol = invocationCheck(symbol);
    if (cryptoSymbol == 'error'){
        console.log('shithead');
        return 'error';
    }
    var timestamp = Math.floor(new Date() / 1000) //unix timestamp
    var coinDaemon = coinDaemonConnector.connectOne(cryptoSymbol); //node-bitcoin client
    var cryptoAddress = coinDaemon.getNewAddress;
    result = database.recordNewAddressRelationship(cryptoAddress, cryptoSymbol, externalAccount, timestamp);
    return result;
}

console.log(getAddress());

module.exports = {
    "getAddress": getAddress
}



/*
#TODO: arg for num of addresses to generate
*/