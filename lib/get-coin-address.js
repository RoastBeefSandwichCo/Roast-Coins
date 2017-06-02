//#TODO: add command to associate account with existing crypto address
var coinDaemonConnector = require('./coin-daemons.js'); //hopefully returns two methods
//access to an array of node-bitcoin clients using cryptocurrencies.json and a single-client connector
//var config = require('../config/config.json');
var database = require('../models/database.js');
var cryptocurrencies = require('../config/cryptocurrencies.json');

function invocationCheck(symbol) {
//    console.log('invocationCheck: symbol:', symbol, '\TYPEOF:', typeof symbol);
    if (typeof symbol === 'undefined') { // is CLI invocation or bad call
        //[0] = node, [1] = get-coin-address, [2] = symbol, [3] = externalAccount
        if (process.argv.length < 4) { //missing arg!
            console.error('usage: node get-coin-address.js <coin symbol> <externalAccount>');
            console.error('where externalAccount will be paired with new coin address');
            database.closeDb();
            return 'error';
        }
        else{
            process.argv[2] == "--manual" ? symbol = process.argv[3] : symbol = process.argv[2].toUpperCase();
            if (cryptocurrencies.hasOwnProperty(symbol)) {
                console.log ('CLI invocation. Assigning symbol', symbol);
                return symbol; // 
            }
            else{
                console.error('CLI invocation. Symbol ' + symbol + ' is not in cryptocurrencies.json');
                return 'error';
            }
        }
    }
    else{
        console.log ('external module call. Assigning symbol', symbol.toUpperCase());
        return symbol.toUpperCase(); // good call by another module
    }
}

function setExternalAccount(){
    if (typeof externalAccount === 'undefined') { //under any circumstances, no account given to associate
        var useAccount = 'NULL';
        if  (process.argv.length > 3){ //check CLI
            useAccount = process.argv[3];
        }
        console.log('EXTERNAL ACCOUNT returning:', useAccount);
        return useAccount;
    }
}


var generateNewAddress = function(symbol, externalAccount){
    externalAccount = setExternalAccount(externalAccount);
    var cryptoSymbol = invocationCheck(symbol);
    if (cryptoSymbol == 'error'){
        console.log('shithead');
        return 'error';
    }
    if (process.argv[2] == "--manual") {
        cryptoSymbol = process.argv[3];
        externalAccount = process.argv[4];
        cryptoAddress = process.argv[5];
        console.log('MANUAL address association:', process.argv[3], process.argv[4], process.argv[5])
        console.log('writing...');
        var timestamp = Math.floor(new Date() / 1000) //unix timestamp
        db = database.recordNewAddressRelationship(cryptoAddress, cryptoSymbol, externalAccount, timestamp);        
    }
    else{
        var timestamp = Math.floor(new Date() / 1000) //unix timestamp
        var coinDaemon = coinDaemonConnector.connectOne(cryptoSymbol); //node-bitcoin client
        coinDaemon.getNewAddress(function (err,cryptoAddress){
            if (err) {
                console.log('some bad juju with the daemon. err:', err)
            }
            else{
                console.log('generated:', cryptoAddress, '\nWriting to db...');
                db = database.recordNewAddressRelationship(cryptoAddress, cryptoSymbol, externalAccount, timestamp);
                console.log ("i'm here");
                //sleep (2000);
                console.log(db)
            }
        });
        return 'some output';
    }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


module.exports = {
    "generateNewAddress": generateNewAddress
}

console.log(generateNewAddress());


/*
#TODO: arg for num of addresses to generate
*/
