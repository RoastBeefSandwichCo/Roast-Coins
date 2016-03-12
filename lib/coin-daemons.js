var bitcoin = require ('bitcoin'); //https://www.npmjs.org/package/bitcoin greatly simplifies interfacing with coin daemons
var coins = require ("../config/cryptocurrencies.json");//coin configurations
var sep = '\n--------------------------------------------------------\n';
var coinDaemons = {};
var logPrefix = 'coin-daemons: ';
var runSelfTest = false;
//console.log('logPrefix', logPrefix);

var connectOne = function(coinSymbol){
//  console.log('coinSymbol:', coinSymbol);
  if (typeof coinSymbol === 'undefined') {
    if (logger != undefined) {
        logger.error('COINSYMBOL UNDEFINED')
    }
    else{
      console.error('COINSYMBOL UNDEFINED');
    }
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

var getDaemonPool = function (logger){ //no autoload
  this.logger = logger;
  logger.log('info', logPrefix + 'Loading coins.');
  for (var each in coins){ //instantiate coin objects from cryptocurrencies.json
	logger.log('verbose', logPrefix + 'each:' + each);
    coinDaemons[each] = connectOne(each);
    }
return coinDaemons;
}

if (runSelfTest == true){
  coinDaemons = getDaemonPool();
  for (var each in coinDaemons){
    console.log(logPrefix,each);
  }
  var thisWithdrawal = require ("./exampleTX.json")
  console.log(thisWithdrawal);
}


//var daemonPool = getDaemonPool(logger); //alias pending function rename

module.exports = {
  //"daemonPool": daemonPool,
  "getDaemonPool": getDaemonPool,
  "connectOne": connectOne
  }

//#FIXME: export change probably breaks old calls to this module