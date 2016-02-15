#!/bin/bash
#Installs Roast Coins using npm and initializes the database (must be in root Roast-Coins directory)
#This is run automatically by setup.sh
cd ..
npm install

#Create account association table
node models/database.js createTable