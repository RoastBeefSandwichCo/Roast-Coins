Roast Coins
============

A universal cryptocurrency wallet backend by Roast Beef Sandwich Company.

##Progress
A partial rewrite and significant enhancement set over [Ripple-Coins](https://github.com/RoastBeefSandwichCo/ripple-coins), full functionality is expected by Feb 29, 2016

*update*: get-new-address is complete and released. This module can be invoked from the command line to generate a new cryptocurrency address on-demand and automatically associate it with a provided external address. For more information go to the lib directory and (after installation) run ``node get-new-address.js``

## Dependencies

1. [Nodejs 4.x] (https://github.com/nodesource/distributions)
2. [node-bitcoin](https://www.npmjs.org/package/bitcoin)
  - Node module providing *coin connection objects
  - Moving to [node-dogecoin](https://www.npmjs.org/package/node-dogecoin)!

3. [Almost any cryptocurrency daemon](https://github.com/dogecoin/dogecoin)(local or remote)
  - These modules aim to be crypto-agnostic, so any daemon with (the de facto standard) bitcoin-compatible RPC calls (sendtoaddress, sendfromaccount...) should do.

4. [Gatewayd](https://github.com/ripple/gatewayd) - OPTIONAL and atm BROKEN
  - Provides easy deposit and withdrawal management (and endpoints in Ripple REST)
  - Provides [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager), [Ripple REST API](https://github.com/ripple/ripple-rest.git)

5. [node-rest-client](https://www.npmjs.org/package/node-rest-client) - for gatewayd only
  - Easy interfacing with gatewayd api

## Installation
 - Development: clone the repo, fumble around, good luck!
 - Production: Run setup.sh in the scripts directory. This will install mysql on Debian 8 or LAMP on Ubuntu 12.04+. *Comment/Uncomment the appropriate lines*. It will create the required database and user, install the Roast Coins package with npm, and then call it to initialize its table. *If you already have mysql installed*, replace occurrences of $MYSQL_ROOT_PW with your msql root pw. Don't forget to clean up afterward.
 
## Tests

Testing with mocha are to be re-implemented.
Run this tests with mocha

    npm install -g mocha
    mocha -R spec test/

## Usage
   - `npm start`. Not yet implemented. #TODO

##Processes:
 1. Withdrawals:
   - Read database for pending withdrawals, initiate blockchain transactions via RPC, store TXID and relevant infos for use by gateway/exchange
   - [RPC](https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list) to coin daemon via node-bitcoin
   - add database deps/infos here #TODO
 2. Deposits:
   - Monitor blockchain for incoming transactions, record relevant deposits for gateway/exchange use.

## TODO:
 - List unsupported coins, extend to crypto 2.0 apis.
 - Addresses should really [only be used once](https://en.bitcoin.it/wiki/Address). Let's find a way to do that.

##CAVEAT:
 - Ninobrooks is a javascript noob and makes no pretense that his code is elegant or purdy. He in fact welcomes (begs) others to clean it up and improve it. The only reason he's doing this in the first place is because far more talented people have had more pressing matters to attend to. Also, he's going to stop talking about himself in the third person.

##Thanks!
 - To everyone who donates, contributes code, or has developed a module I'm using. In particular everyone who's worked on nodejs and @freewil et al for node-bitcoin.

 - [The Rock Trading Ltd](https://www.therocktrading.com) for financial support. The Rock is a UK-based *ripple-integrated* exchange and gateway (XRPGA Gateway ftw!) with crypto-fiat trading for EUR, USD, BTC, LTC, DOGE and more, *and* derivatives. Check them out, sign up, use my promoter code :D therocktrading.com/referral/79
Thanks, Rock. Your donations came at a critical time for us. Your private encouragement via correspondence and promotion of our efforts on Twitter are appreciated, too!

##Donate

Help us with development costs (pretty please)! Ways to contribute:
  - Ripples!(XRP) rPyBms1XZtNbF4UFGgM1dDWTmtfDmsfGNs
  - PayPal: darthcookient@gmail.com
  - Bitcoin 1K2BZ3XxpRNiNissEHoVcrCv3tEqEsHP28
  - Litecoin LgaoNgSNxJwyno61edyRUz2ZKFkgPQYV5t
  - Dogecoin D7U9VyJsStZ23MPgTr2TxGLj4bdfs69b8e
  - Stellar (STR): ninobrooks
  - If you would like to donate hardware, remote servers or in any other way, please contact me directly!
