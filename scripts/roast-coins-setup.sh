#!/usr/bin
#install using npm (must be in root Roast-Coins directory)
cd ..
npm install

#Create account association table
node models/database.js createTable