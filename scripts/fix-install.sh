#I screwed stuff up periodically so...
#Assuming you don't know your cryptographically secure mysql root password, which you won't:

#This will reset root password and drop the roast_coins user
#http://stackoverflow.com/a/6401963/1414479 (with edits by me here)
#sudo service mysql stop
#sudo mysqld --skip-grant-tables --skip-networking &
#mysql
#
#mysql> update mysql.user set password = password('testpw') where user = 'root';
#mysql>drop user 'roast_coins'@'localhost';
#mysql> flush privileges;
#mysql> exit;
#sudo mysqladmin shutdown
#sudo service mysql restart


MYSQL_ROOT_PW="testpw"
MYSQL_ROAST_COINS_PW="testpw"
echo mysql -u root -p$MYSQL_ROOT_PW -e "CREATE USER 'roast_coins'@'localhost' IDENTIFIED BY '$MYSQL_ROAST_COINS_PW';"
mysql -u root -p$MYSQL_ROOT_PW -e "CREATE USER 'roast_coins'@'localhost' IDENTIFIED BY '$MYSQL_ROAST_COINS_PW';"
echo mysql -u root -p$MYSQL_ROOT_PW -e "FLUSH PRIVILEGES;"
mysql -u root -p$MYSQL_ROOT_PW -e "FLUSH PRIVILEGES;"
echo mysql -u root -p$MYSQL_ROOT_PW -e "CREATE DATABASE roast_coins;"
mysql -u root -p$MYSQL_ROOT_PW -e "CREATE DATABASE roast_coins;"
echo mysql -u root -p$MYSQL_ROOT_PW -e "GRANT ALL PRIVILEGES ON roast_coins.* TO roast_coins@'localhost';"
mysql -u root -p$MYSQL_ROOT_PW -e "GRANT ALL PRIVILEGES ON roast_coins.* TO roast_coins@'localhost';"
