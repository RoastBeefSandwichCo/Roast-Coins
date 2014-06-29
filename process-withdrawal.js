https://www.npmjs.org/package/bitcoin
require ("bitcoin");
//note: note all commands are supported by all bitcoin clients, but there is enough consistency
//for our purposes and this library allows us to offer extensibility to future maintainers

var coins = require ("./cryptocurrencies.json"); //may need to JSON.parse(coins)
goes in constructor:
for each property in coins:
//create connection to recycle. Should scale to higher loads better than connecting for every tx
    var propertyname = new bitcoin.Client({
      host: 'localhost',
      port: coins.(transaction[index].currency).port,
      user: coins.(transaction[index].currency).rpcusername,
      pass: coins.(transaction[index].currency).rpcpassword,
      timeout: 30000
    });





//external call instantiates
function coinProcessing(transaction){

should look something like:
sendtoaddress  address                                     amount                                         comment
propertyname.sendToAddress  transaction.withdrawals.external_account_id transacton.withdrawals.(convertToNumber)amount "'ripple_transaction_id'"

}
payout method needs to return tx to a callback to
clear withdrawal

//http://github.com/ripple/gatewayd#listing-withdrawals
/*{
  "withdrawals": [
    {
      "data": null,
      "id": 79,
      "amount": "1001",
      "currency": "SWD",
      "deposit": false,
      "external_account_id": 6,
      "status": "queued",
      "ripple_transaction_id": 80,
      "createdAt": "2014-05-30T19:23:48.390Z",
      "updatedAt": "2014-05-30T19:23:48.390Z",
      "uid": null
    },
    {
      "data": null,
      "id": 84,
      "amount": "8.5",
      "currency": "SWD",
      "deposit": false,
      "external_account_id": 6,
      "status": "queued",
      "ripple_transaction_id": 85,
      "createdAt": "2014-06-11T00:23:56.992Z",
      "updatedAt": "2014-06-11T00:23:56.992Z",
      "uid": null
    }
  ]

}*/
