#!/bin/bash
#Initializes database for use by Roast Coins.
#run like so: ./setup.sh


mysql -u root -p$MYSQL_ROOT_PW -e "CREATE USER 'test01'@'localhost' IDENTIFIED BY 'test01';"
mysql -u root -p$MYSQL_ROOT_PW -e "CREATE DATABASE test01;"
mysql -u root -p$MYSQL_ROOT_PW -e "GRANT ALL PRIVILEGES ON test01.* TO test01@'localhost';"
echo "NOW CHANGE THE MYSQL ROOT PASSWORD"
echo "NOW CHANGE THE MYSQL ROOT PASSWORD"
echo "NOW CHANGE THE MYSQL ROOT PASSWORD"
echo 
echo "NOW CHANGE THE MYSQL ROOT PASSWORD"
echo "NOW CHANGE THE MYSQL ROOT PASSWORD"
echo "NOW CHANGE THE MYSQL ROOT PASSWORD"

