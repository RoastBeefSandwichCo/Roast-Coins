"use strict";
var mysql = require('mysql');
var dbProperties = require('../config.json');

//check-init
  //function does db exist
  //create if not exists table

//well this sure is an awkward hybrid of dynamic and hard code. WIP!
var mysqlConnection = function(){
    var connection = mysql.createConnection({
      "host": dbProperties[dbProperties.database.type].host,
      "port": dbProperties[dbProperties.database.type].port,
      "user": dbProperties[dbProperties.database.type].user,
      "password": dbProperties[dbProperties.database.type].password,
      "database": dbProperties[dbProperties.database.type].database,
      "debug": dbProperties[dbProperties.database.type].debug
    });
    
    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
    
      console.log('connected as id ' + connection.threadId);
    });
return connection;
}

var createAddressTable = function(){

//Primary key IDs auto increment as an integer and are not null.
//CREATE if not exists DATABASE Roast_Coins
//CREATE if NOT EXISTS table accountCoinAddresses (id autoincrement not null int, ripple NOT NULL varchar(60) )

    } //#FIXME finish me

var recordNewAddress = function(cryptoAddress, cryptoSymbol, externalAddress, timestamp){
    var post =  {"timestamp": timestamp, "cryptoSymbol": cryptoSymbol, "cryptoAddress": cryptoAddress, "externalAddress": externalAddress};
    var connection = database.connectTo('roast_coins');
    var query = connection.query('INSERT INTO external_account_crypto_pairs SET ?', post, function(err, result){
        if (err) {
            console.log('MYSQL ERR:', err, '\nMYSQL RES:', result)
            return 'error';
        }
        else {
        console.log(query.sql);
        //call debugOutput function
        return true;
        }
    });
}











//FOR PG
/*http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/
//var pg = require('pg');
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });*/

//TODO: ADD TO DOC: 'mysql -u root -p -e "CREATE USER 'test' IDENTIFIED BY 'test';"
//#some code from https://github.com/felixge/node-mysql