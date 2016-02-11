var coinDaemonConnector = require ('./coin-daemons.js'); //returns an array of node-bitcoin clients using cryptocurrencies.json
var config = require ('../config/config.json')
//should probably reduce that to only the new coin.

//ACCEPT command line ARG: coinName
coinDaemon = coinDaemonConnector.connectOne(coinName);
address = coinDaemon.getNewAddress;

connectToDB();
/* connect to config.database.[config.database.type]
Primary key IDs auto increment as an integer and are not null.
get db object
CREATE if not exists DATABASE Roast_Coins
CREATE if NOT EXISTS table accountCoinAddresses (id autoincrement not null int, ripple NOT NULL varchar(60) )
connect to api
write infos.
*/



/*
Create users table: 
CREATE TABLE users (user_id int NOT NULL, email NOT NULL varchar(60), ripple NOT NULL varchar(60), fname NOT NULL varchar(60),
lname NOT NULL varchar(60), PRIMARY KEY (user_id), FK (public_id))
*/
