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

function newBlock(coinSymbol, bestBlockHash) {
    //asynchronously call new-block (fire and forget)
   logger.debug('function newBlock');
   endpointNewBlock.newBlock(coinSymbol, bestBlockHash, this.db, this.coinDaemonPool);
    //TODO: type check for String
    return ('coin:' + coinSymbol + 'block:' + bestBlockHash)
}

function main(database, coinDaemons, logger) {
   this.db = database;
   this.coinDaemonPool = coinDaemons;
   this.logger = logger;
   //logger.debug('coinDaemonPool:',this.coinDaemonPool) //holy shit that's a lot of output
   app.get('/GET/newblock/:coinSymbol/:bestBlockHash', function (req, res) {
   //app.get('/GET/newblock/', function (req, res) {
      console.log(req.params);
      console.log(req.params.coinSymbol);
      console.log(req.params.bestBlockHash);
      whatDo = newBlock(req.params.coinSymbol, req.params.bestBlockHash, this.db, this.coinDaemonPool);
         res.end(whatDo);
         });

   
   //#TODO: configuration file
   var server = app.listen(8081, function () {
      var host = server.address().address
      var port = server.address().port
      console.log("Locator api listening at http://%s:%s", host, port)
   });
//console.log(server);
   //console.log("Locator api listening at http://%s:%s", host, port)
   return server;
}

main();

module.exports = {
   "start": main
}
//http://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm
//http://stackoverflow.com/a/20638212/1414479
//https://coderwall.com/p/mrio6w/split-lines-cross-platform-in-node-js
//http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously
