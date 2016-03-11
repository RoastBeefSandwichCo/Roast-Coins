#dependencies
yum install epel-release
yum update
sudo yum install git nodejs postgresql-server
git clone https://github.com/Roastbeefsandwichco/roast-coins.git
sudo postgresql-setup initdb && sudo systemctl start postgresql && sudo systemctl enable postgresql

#generate/set postgresql passwords, create rc db
randpw(){ < /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-16};echo;}
user_postgres_pw=$(randpw 20) && user_roast_coins_pw=$(randpw 20)
echo user_postgres_pw=$user_postgres_pw
echo user_roast_coins_pw=$user_roast_coins_pw

sudo su - postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD '$user_postgres_pw';\""
sudo su - postgres -c "psql -c \"CREATE USER roast_coins WITH PASSWORD '$user_roast_coins_pw';\""
sudo su - postgres -c "psql -c \"CREATE DATABASE roast_coins WITH OWNER roast_coins ENCODING='utf8';\""
#enable password login req for knex to work
#FIXME: /var/lib/pgsql/pg_hba.conf change ident to md5

#Insert Roast Coins database pw into config, it must be there for initialization by roast-coins-init.sh
cp ../config/config.example.json ../config/config.json
#TODO: needs work
#sed -i "s/PASSWORD GOES HERE/$MYSQL_ROAST_COINS_PW/g" ../config/config.json


73.178.163.238