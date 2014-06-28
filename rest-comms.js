//Retrieve pending deposits and withdrawals from REST api
//uses code from https://www.npmjs.org/package/node-rest-client
//Bunch of unused stuff kept for future reference

//This module retrieves deposits and withdrawals on request *after* listener.js received a ledger close
//An event-bsed model rather than simply polling the api.


var Client = require('node-rest-client').Client;
client = new Client();
args ={
        path:{"id":120}, // will be either pending_withdrawals or deposits. later. unused right now.
        parameters:{arg1:"hello",arg2:"world"}, // query parameter substitution vars
        headers:{"Accepts":"application/json"} // request headers
      };

//use later during withdrawal testing.
//client.registerMethod("jsonMethod", "http://remote.site/rest/json/${id}/method", "GET");
client.registerMethod("jsonMethod", "http://localhost:5990/v1", "GET");

//QUERY API
client.methods.jsonMethod(args,function(data,response){
    jsData = JSON.parse(data);
    console.log(jsData);
    console.log('---------------------\n\n');
    console.log('endpoints :', jsData.endpoints);
    console.log('data.endpoints.server_connected :', jsData.endpoints.server_connected);
});



//client.get("http://remote.site/rest/json/${id}/method?arg1=hello&arg2=world", args, 
/*client.get("http://localhost:5990/v1", args, 

            function(data, response){
            // parsed response body as js object
            console.log(data);
            // raw response
            console.log(response);
});
*/
