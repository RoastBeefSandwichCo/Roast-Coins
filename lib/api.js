//api endpoints
//getNewAddress
//newBlock // endpoint for new block notification.

//taken from another RBSC project, to be repurposed as api server for
//Roast Coins


//minimal server to take queries for ip-locate.py
//https://github.com/RoastBeefSandwichCo

var express = require('express');
var app = express();
var fs = require("fs");
var childProcess = require('child_process');
var os = require('os');



var kid = {
   lines: "WE'RE ALL GONNA DIE MAN!",
   lastLine: 'NOTHING HERE! THIS IS BAD!',
   kidlet: function(ip, somevar, callback){
      childProcess.execFile('./ip-locate.py', ['-a', ip], function(error, stdout, stderr){
         if (error !== null) {
              console.log('exec error: ' + error);
              return "internal error. fuck!";
         }
         console.log('somevar: ', somevar)
         callback(stdout);
         return 'lastLine???';
   });
   }
};

app.get('/locate/:address', function (req, res) {
   ip = 'test';
   x = kid;
   x.kidlet(req.params.address, 'a var!', function(data){
      var lines = data.split(os.EOL);
      var lastLine = lines[lines.length -2];
      console.log ('last line:', lastLine);
      res.end(lastLine);
      });
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Locator api listening at http://%s:%s", host, port)

});

//http://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm
//http://stackoverflow.com/a/20638212/1414479
//https://coderwall.com/p/mrio6w/split-lines-cross-platform-in-node-js
//http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously
