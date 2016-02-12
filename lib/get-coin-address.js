var coinDaemonConnector = require('./coin-daemons.js'); //returns an array of node-bitcoin clients using cryptocurrencies.json
var config = require('../config/config.json');
var database = require('../models/database.js');

//should probably reduce that to only the new coin.

var cryptoSymbol = process.argv[2] //coin symbol from command line, e.g. BTC, LTC, DOGE
var timestamp = Math.floor(new Date() / 1000) //unix timestamp
var coinDaemon = coinDaemonConnector.connectOne(cryptoSymbol); //node-bitcoin client
var cryptoAddress = coinDaemon.getNewAddress; //#FIXME: find api call in node-bitcoin documentation

asd = function(){
    var connection = database.connectTo('Roast_Coins');
    var post =  {"timestamp": timestamp, "cryptoSymbol": cryptoSymbol, "cryptoAddress": cryptoAddress};
    var query = connection.query('INSERT INTO external_account_crypto_pairs SET ?', post, function(err, result){
        //call debugOutput function
    });
    return aValue;
}

/*
#TODO: validate script invocation "usage: get-coin-address <coin symbol>"
#TODO: arg for num of addresses to generate
*/