#!/bin/bash
#Runs other installation scripts
#Must be run as root or with 'sudo ./setup.sh'
#TODO: FIXME: some stuff shouldn't be done as root if not necessary. Rework.

./lamp-install.sh
./roast-coins-init.sh

