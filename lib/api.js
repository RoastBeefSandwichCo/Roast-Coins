//getNewAddress
//newBlock // endpoint for new block notification.
//withdrawal // endpoint for withdrawal notification
//https://github.com/RoastBeefSandwichCo

//#TODO: clean up requirements
var express = require('express');
var app = express();
var fs = require("fs");
var childProcess = require('child_process');
var os = require('os');
//begin endpoints
var endpointNewBlock = require('./new-block.js');
//end endpoints
var db = null;
var coinDaemonPool = null;
var logPrefix = 'api: ';

function api (coinDaemonPool, database, logger, withdrawalHandler){
   this.coinDaemonPool = coinDaemonPool;
   this.database = database;
   this.logger = logger;
   this.withdrawalHandler = withdrawalHandler
}

api.prototype.newBlock = function(cryptoSymbol, bestBlockHash, coinDaemonPool, database, logger) {  //asynchronously call new-block (fire and forget)
   //console.log(this.newBlock);
   logger.debug(logPrefix + 'function newBlock');
   logger.debug(logPrefix + 'DATABASE?'+ database);
//   logger.debug(database[0]);
   processBlock = new endpointNewBlock.newBlock(cryptoSymbol, bestBlockHash, coinDaemonPool, database, logger)
    //TODO: type check for String
    return ('coin:' + cryptoSymbol + 'block:' + bestBlockHash)
}

api.prototype.testWithdrawal = function(database, logger){
    var deposit = {
        "bc_address": "BMShVhSFimfHVv4zQbRm58XYN6wJkYdFdx", //the only blockchain-retrieved data not prefixed with bc_
        "crypto_symbol": "BERN",
        "is_finished": 0,  // Finished = 0 = False = Pending.
        "is_inbound": 0,  //0 = false = outbound
        "rc_timestamp": null,  //When the block notification was received by Roast Coins
        "bc_amount": 0.00000001,
//                "bc_blockhash" : txList[each].blockhash,
//                "bc_blockindex" : txList[each].blockindex,
//                "bc_blocktime" : txList[each].blocktime,
        "bc_dest" : "B9xqWsf7PiNdhPo6fCqUCAphzYbcG6j7u6",
//                "bc_time" : txList[each].time,
//                "bc_timereceived" : txList[each].timereceived,
//                "bc_txid" : "NULL",
        "external_address": "free booty!"
    };
    database.recordTransaction(deposit)
      .then(function(data){
        logger.debug('soo uhh... we good?', data);
      });
    logger.info('test deposit', deposit);
    return deposit;
}


api.prototype.start = function(){
   var test = this.testWithdrawal;
   var anewblock = this.newBlock;
   var coinDaemonPool = this.coinDaemonPool;
   var database = this.database;
   var logger = this.logger;
   withdrawalHandler = this.withdrawalHandler;
   
   app.get('/GET/newblock/:coinSymbol/:bestBlockHash', function (req, res) {
      logger.verbose(logPrefix + 'req params ' + req.params.coinSymbol.toString() + ":" + req.params.bestBlockHash.toString());
      //logger.debug('DATABASE:'+ database);
      logger.silly(logPrefix + 'req.params.coinSymbol' + req.params.coinSymbol);
      logger.silly(logPrefix + 'req.params.bestBlockHash' + req.params.bestBlockHash);
      //whatDo = anewblock(req.params.coinSymbol, req.params.bestBlockHash, logger); //holy shit wtf output
      res.end(req.params.coinSymbol +":" + req.params.bestBlockHash +'\n');
      coinSymbol = req.params.coinSymbol.toUpperCase();
      if (coinSymbol in coinDaemonPool) {
         logger.debug(coinSymbol + 'is in coinDaemonPool');
         anewblock(coinSymbol, req.params.bestBlockHash, coinDaemonPool, database, logger);  
      }
      else{
         logger.error('api: NO SUCH DAEMON ' + req.params.coinSymbol);
      }
   });
   app.get('/GET/testwithdrawal', function(req, res){
       var x = test(database, logger).toString();
       res.end(x);
   });
   //#TODO: configuration file

   app.get('/GET/newWithdrawal', function(req, res){
       var x = withdrawalHandler.selectPendingWithdrawals();
       res.end('ack');
   });

   var server = app.listen(8081, function () {
      var host = server.address().address
      var port = server.address().port
      logger.info(logPrefix + "Roast Coins api listening at http://%s:%s", host, port)
   });
   return server;
}

//main();

module.exports = {
   "api": api
}
//http://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm
//http://stackoverflow.com/a/20638212/1414479
//https://coderwall.com/p/mrio6w/split-lines-cross-platform-in-node-js
//http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously
