#dependencies
yum install epel-release
yum update
sudo yum install git nodejs postgresql-server
git clone https://github.com/Roastbeefsandwichco/roast-coins.git
sudo postgresql-setup initdb && sudo systemctl start postgresql && sudo systemctl enable postgresql

#generate/set postgresql passwords, create rc db
randpw(){ < /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-16};echo;}
user_postgres_pw=$(randpw 20) && user_roast_coins_pw=$(randpw 20)

sudo su - postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD '$user_postgres_pw';\""
sudo su - postgres -c "psql -c \"CREATE USER roast_coins WITH PASSWORD '$user_roast_coins_pw';\""
sudo su - postgres -c "psql -c \"CREATE DATABASE roast_coins WITH OWNER roast_coins ENCODING='utf8';\""


73.178.163.238