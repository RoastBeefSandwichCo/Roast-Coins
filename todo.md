#TO-DO list
grepped to-dos and fix-mes

./scripts/lamp-install.sh:#TODO: better path navigation
./scripts/setup.sh:#TODO: FIXME: some stuff shouldn't be done as root if not necessary. Rework.
./scripts/centos7 install.md:#TODO: needs work
./README.md:   - `npm start`. Not yet implemented. #TODO
./README.md:   - add database deps/infos here #TODO
./models/database.js:rcDatabase.prototype.dbCallback = function(results, results2, fields){ //suspect first field can be returned value or error. #TODO: parse appropriately
./models/database.js:rcDatabase.prototype.createTableLastBlockIndex = function(){ //tracks the last block for which we have processed all transactions #TODO: what happens when they're
./models/database.js://#TODO: detect cli invocation for easy table creation
./models/database.js://#TODO: all create functions should return values
./models/database.js://#TODO: #FIXME: closDb at the end of functions is bullshit. fixit.
./models/database.js://#TODO: make this WAY more efficient.
./bin/roast-coins.js:var databaseModule = require('../models/database.js'); //all our abstractions //#TODO:FIXME: CATCH DATABASE FAILURE
./doc/database.md:function createTableLastBlockIndex(){ //tracks the last block for which we have processed all transactions #TODO: what happens when they're
./lib/get-coin-address.js://#TODO: add command to associate account with existing crypto address
./lib/get-coin-address.js:#TODO: arg for num of addresses to generate
./lib/new-block.js:            if (addressField.length == 0) {  //empty response! #TODO: something more constructive here.
./lib/new-block.js://#TODO#FIXME: lock for coin, not globally.
./lib/api.js://#TODO: clean up requirements
./lib/api.js:   //#TODO: configuration file
./scripts/centos7 install.md:#FIXME: /var/lib/pgsql/pg_hba.conf change ident to md5
./models/database.js://#FIXME: frikkin thing.. winston, output, fix.
./lib/new-block.js://#FIXME: seems to not be documenting last block checked
./lib/coin-daemons.js://#FIXME: export change probably breaks old calls to this module
./processes/process-withdrawal.js:var coinDaemons = require ("./coin-daemons.js"); //#FIXME: probably broken after change in coin-daemons.js exports
