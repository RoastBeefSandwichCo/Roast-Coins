var bitcoin = require ('bitcoin'); //https://www.npmjs.org/package/bitcoin greatly simplifies interfacing with coin daemons
var coins = require ("../config/cryptocurrencies.json");//coin configurations
var sep = '\n--------------------------------------------------------\n';
var coinDaemons = {};
var logPrefix = 'coin-daemons';
var runSelfTest = false;
//console.log('logPrefix', logPrefix);

var connectOne = function(coinSymbol){
//  console.log('coinSymbol:', coinSymbol);
  if (typeof coinSymbol === 'undefined') {
    console.error('COINSYMBOL UNDEFINED');
    return 'error'
  }
  bitcoinClient = new bitcoin.Client({ //Name of coin is name of object
      host: coins[coinSymbol].host,
      port: coins[coinSymbol].port,
      user: coins[coinSymbol].rpcusername,
      pass: coins[coinSymbol].rpcpassword,
      //coin polling interval here
      timeout: 30000
      });
  return bitcoinClient
}

function fnClearPending (){
  console.log(logPrefix, 'fnClearPending dummy function.');
}

var loadCryptoConfig = function (){ //no autoload
  console.log(logPrefix, 'Loading coins.');
  for (var each in coins){ //instantiate coin objects from cryptocurrencies.json
	console.log(logPrefix, 'each:' + each);
    coinDaemons[each] = connectOne(each);
    }
return coinDaemons;
}

if (runSelfTest == true){
  coinDaemons = loadCryptoConfig();
  for (var each in coinDaemons){
    console.log(logPrefix,each);
  }
  var thisWithdrawal = require ("./exampleTX.json")
  console.log(thisWithdrawal);
}

var daemonPool = loadCryptoConfig(); //alias pending rename of function

module.exports = {
  "daemonPool": daemonPool,
  "loadCryptoConfig": loadCryptoConfig,
  "connectOne": connectOne
  }

//#FIXME: export change probably breaks old calls to this module