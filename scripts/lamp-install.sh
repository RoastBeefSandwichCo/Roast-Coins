#!/bin/bash
#Installs Linux Apache MySQL PHP stack on Ubuntu or just mysql on Debian 8

#Bypass the mysql root password prompt for a non-interactive install with secure pw
#No you wont' know the password. But you obviously have root; you can reset it later
randpw(){ < /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-16};echo;}
MYSQL_ROOT_PW=`randpw 20`
echo "MYSQL_ROOT_PW:$MYSQL_ROOT_PW"
MYSQL_ROAST_COINS_PW=`randpw 20`
echo "MYSQL_ROAST_COINS_PW:$MYSQL_ROAST_COINS_PW"
export MYSQL_ROAST_COINS_PW=$MYSQL_ROAST_COINS_PW
echo mysql-server mysql-server/root_password password $MYSQL_ROOT_PW | sudo debconf-set-selections
echo mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PW | sudo debconf-set-selections

#On Debian, you must install the LAMP components manually, but for mysql only:
sudo apt-get install mysql-server mysql-client -y
#Comment out the above line and uncomment the line below for Ubuntu LAMP installation
#sudo apt-get install lamp -y

#Install Roast Coins database user.
#@'localhost' is used because this is automated. Advanced users working with remote db don't need this script.
echo mysql -u root -p$MYSQL_ROOT_PW -e "CREATE USER 'roast_coins'@'localhost' IDENTIFIED BY '$MYSQL_ROAST_COINS_PW';"
mysql -u root -p$MYSQL_ROOT_PW -e "CREATE USER 'roast_coins'@'localhost' IDENTIFIED BY '$MYSQL_ROAST_COINS_PW';"
echo mysql -u root -p$MYSQL_ROOT_PW -e "CREATE DATABASE roast_coins;"
mysql -u root -p$MYSQL_ROOT_PW -e "CREATE DATABASE roast_coins;"
echo mysql -u root -p$MYSQL_ROOT_PW -e "GRANT ALL PRIVILEGES ON roast_coins.* TO roast_coins@'localhost';"
mysql -u root -p$MYSQL_ROOT_PW -e "GRANT ALL PRIVILEGES ON roast_coins.* TO roast_coins@'localhost';"

#Insert Roast Coins database pw into config, it must be there for initialization by roast-coins-init.sh
cp ../config/config.example.json ../config/config.json
sed -i "s/PASSWORD GOES HERE/$MYSQL_ROAST_COINS_PW/g" ../config/config.json
#TODO: better path navigation

