//THE MAIN MODULE
//#TODO: how shutdown api?
//#TODO: when shutdown db?

//open database, provide connection pool
//start api

var database = require('./models/database.js').knex;  //The db connection pool
var api = require('./lib/api.js');

function main() {
    api.start(database);
}


main();