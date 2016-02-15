#!/bin/bash
#Installs Linux Apache MySQL PHP stack
#run as root or with 'sudo lamp-install.sh'
#also executed by setup.sh

#bypass the mysql root password prompt for a non-interactive install
#No you wont' know the password. But you obviously have root, so you can reset it later
echo mysql-server mysql-server/root_password password strangehat | sudo debconf-set-selections
echo mysql-server mysql-server/root_password_again password strangehat | sudo debconf-set-selections
#On Debian, you must install the components manually, but here, you may as well
#sudo apt-get install mysql-server mysql-client
sudo apt-get install lamp -y