#!/bin/bash
#Installs Linux Apache MySQL PHP stack
#run like so: ./setup.sh

#bypass the mysql root password prompt for a non-interactive install with secure pw
#No you wont' know the password. But you obviously have root; you can reset it later

#pretty this up after testing
randpw(){ < /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-16};echo;}
mysqlrootpw=`randpw 20`
echo "mysqlrootpw:$MYSQL_ROOT_PW"


echo mysql-server mysql-server/root_password password $MYSQL_ROOT_PW | sudo debconf-set-selections
echo mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PW | sudo debconf-set-selections
#On Debian, you must install the LAMP components manually, but for mysql only:
sudo apt-get install mysql-server mysql-client -y
#sudo apt-get install lamp -y