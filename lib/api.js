//getNewAddress
//newBlock // endpoint for new block notification.
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
var logger = null;

function api (coinDaemonPool, database, logger){
   this.logger = logger;
   this.database = database;
   this.coinDaemonPool = coinDaemonPool;
}

api.prototype.newBlock = function(coinSymbol, bestBlockHash, database, coinDaemonPool, logger) {
   //var logger = this.logger;
    //asynchronously call new-block (fire and forget)
   //console.log(this.newBlock);
   logger.debug('function newBlock');
   endpointNewBlock.newBlock(coinSymbol, bestBlockHash, coinDaemonPool, database, logger);
    //TODO: type check for String
    return ('coin:' + coinSymbol + 'block:' + bestBlockHash)
}

api.prototype.start = function(){
   var anewblock = this.newBlock;
   var coinDaemonPool = this.coinDaemonPool;
   var database = this.database;
   var logger = this.logger;
   
   app.get('/GET/newblock/:coinSymbol/:bestBlockHash', function (req, res) {
      logger.verbose(req.params);
      logger.silly(req.params.coinSymbol);
      logger.silly(req.params.bestBlockHash);
      //whatDo = anewblock(req.params.coinSymbol, req.params.bestBlockHash, logger); //holy shit wtf output
      res.end(req.params.coinSymbol +":" + req.params.bestBlockHash +'\n');
      endpointNewBlock.newBlock(req.params.coinSymbol, req.params.bestBlockHash, database, coinDaemonPool, logger);
         });
   
   //#TODO: configuration file
   var server = app.listen(8081, function () {
      var host = server.address().address
      var port = server.address().port
      logger.info("Roast Coins api listening at http://%s:%s", host, port)
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
