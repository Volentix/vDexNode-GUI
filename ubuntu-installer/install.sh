#!/bin/bash
#######################################
# Installing the vDexNode
#######################################

## Update packages and Upgrade system
sudo apt-get update -y

echo '###Installing git...'
echo ''
sudo apt-get install git -y

echo ''
echo '###Installing docker...'
echo ''
sudo apt-get remove docker docker-engine docker.io containerd runc -y
sudo apt-get update -y
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update -y
sudo apt-get install docker-ce docker-ce-cli containerd.io build-essential -y
sudo usermod -aG docker $(whoami)

echo ''
echo '###Cloning the vDexNode repo...'
echo ''
(cd ~ && git clone https://github.com/Volentix/vDexNode.git)

echo ''
echo '###Build the docker image...'
echo ''
(cd ~/vDexNode/docker && sudo docker build -t volentix/node .)

echo ''
echo '###Create desktop shortcut...'
echo ''
PUBKEY=$(zenity --entry --title="Public key" --text="Enter your public key")

COMMAND='(cd ~/vDexNode/docker && docker run -d --name volentixnode -e "IP=95.216.0.79:9080" -e "EOSKEY=$PUBKEY" -p 9080:9080 -p 8100:8100 -p 4222:4222/udp volentix/node)'

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

echo ''
echo ''
echo '###Please, reboot your computer or just log out and back in...'
echo ''