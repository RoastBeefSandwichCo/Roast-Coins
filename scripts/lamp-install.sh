#!/bin/bash
#Installs Linux Apache MySQL PHP stack
#run like so: ./setup.sh

#bypass the mysql root password prompt for a non-interactive install with secure pw
#No you wont' know the password. But you obviously have root; you can reset it later

#pretty this up after testing

randpw(){ < /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-16};echo;}
MYSQL_ROOT_PW=`randpw 20`
echo "MYSQL_ROOT_PW:$MYSQL_ROOT_PW"

echo mysql-server mysql-server/root_password password $MYSQL_ROOT_PW | sudo debconf-set-selections
echo mysql-server mysql -server/root_password_again password $MYSQL_ROOT_PW | sudo debconf-set-selections
#On Debian, you must install the LAMP components manually, but for mysql only:
sudo apt-get install mysql-server mysql-client -y
#sudo apt-get install lamp -y

#install Roast Coins user.
#@'localhost' is used because this is automated. Advanced users working with remote db don't need this script.
MYSQL_ROAST_COINS_PW=`randpw 20`
echo "MYSQL_ROAST_COINS_PW:$MYSQL_ROAST_COINS_PW"
echo mysql -u root -p$MYSQL_ROOT_PW -e "CREATE USER 'roast_coins'@'localhost' IDENTIFIED BY '$MYSQL_ROAST_COINS_PW';"
echo mysql -u root -p$MYSQL_ROOT_PW -e "CREATE DATABASE roast_coins;"
echo mysql -u root -p$MYSQL_ROOT_PW -e "GRANT ALL PRIVILEGES ON roast_coins.* TO roast_coins@'localhost';"

cp config/config.example.json config/config.json
echo "mysql roast_coins user password is:$MYSQL_ROAST_COINS_PW" > config/PASSWORD.TXT
echo "edit config/config.json with appropriate database settings"
echo "user password is in config/password.txt"
