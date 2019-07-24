#!/bin/bash
#######################################
# Installing the vDexNode
#######################################

## Update packages and Upgrade system
sudo apt-get update -y

echo '###Installing dependencies...'
sudo apt-get install git docker -y

echo '###Cloning the vDexNode repo...'
(cd ~ && git clone git@github.com:Volentix/vDexNode.git)

echo '###Build the docker image...'
(cd ~/vDexNode && docker build -t volentix/node .)

echo '###Create desktop shortcut...'
PUBKEY=$(zenity --entry --title="Public key" --text="Enter your public key")

COMMAND="(cd ~/vDexNode && docker run -d --name volentixnode -e "IP=95.216.0.79:9080" -e "EOSKEY=$PUBKEY" -p 9080:9080 -p 8100:8100 -p 4222:4222/udp volentix/node)"

touch ~/Desktop/vDexNode.desktop
sudo chmod +x ~/Desktop/vDexNode.desktop

echo "#!/usr/bin/env xdg-open
[Desktop Entry]
Version=1.0
Type=Application
Terminal=false
Exec=bash -c '$COMMAND'
Name=vDexNode
Comment=vDexNode
Icon=/usr/share/icons/Adwaita/256x256/devices/drive-multidisk.png" > ~/Desktop/vDexNode.desktop

