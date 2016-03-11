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

var db = something;

function newBlock(coinSymbol, bestBlockHash) {
    //asynchronously call new-block (fire and forget)
   endpointNewBlock(coinSymbol, bestBlockHash);
    //TODO: type check for String
    return ('coin:' + coinSymbol + 'block:' + bestBlockHash)
}

function main(database) {
   this.db = database;
   app.get('/GET/newblock/:coinSymbol:bestBlockHash', function (req, res) {
      ip = 'test';
      x = kid;
      x.kidlet(req.params.coinSymbol, req.params.bestBlockHash, function(data){
         res.end(data);
         });
   });
   
   //#TODO: configuration file
   var server = app.listen(8081, function () {
      var host = server.address().address
      var port = server.address().port
   });
   console.log("Locator api listening at http://%s:%s", host, port)
   return server;
}

module.exports = {
   "start": main
}
//http://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm
//http://stackoverflow.com/a/20638212/1414479
//https://coderwall.com/p/mrio6w/split-lines-cross-platform-in-node-js
//http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously
