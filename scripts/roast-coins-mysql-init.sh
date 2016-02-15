#!/bin/bash
#Initializes database for use by Roast Coins.
#run as root or with 'sudo mysql-setup.sh'
#Also executed by setup.sh

mysqls -u root -p -e "CREATE USER 'test01'@'localhost' IDENTIFIED BY 'test01';"
mysqls -u root -p -e "CREATE DATABASE test01;"
mysqls -u root -p -e "GRANT ALL PRIVILEGES ON test01.* TO test01@'localhost';"