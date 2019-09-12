# vDexNode-GUI application
<img width="1424" alt="Screen_Shot_2019-09-11_at_8_49_15_AM" src="https://user-images.githubusercontent.com/2269864/64713340-889e9d00-d471-11e9-879d-fe43fd22614e.png">


## Prerequisites
For the application to work, it is **recommended** to use the **YARN** package manager, however, with the **NPM**, the application will also work.

### 1. Node.js
If you don't have Node.js installed in your system you can follow the official instructions to do that: [Node.js install](https://nodejs.org/en/)

> You can install any **LTS** or **Current** version on your machine.

### 2. Package manager
#### Option 1: NPM
If you installed the Node.js correctly you already have the latest **NPM** installed.
#### Option 2: YARN (recommended)
##### Ubuntu
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update

sudo apt install yarn
```
##### MacOS
```bash
brew install yarn
```
##### Other
You can follow the instructions from official website: [YARN](https://yarnpkg.com/en/docs/install)

### 3. Quasar
If you don't have a quasar installed use the following command:
```bash
npm install -g @quasar/cli
```

## Installation
```bash
# Clone the repo
git clone https://github.com/Volentix/vDexNode-GUI.git
# Go to the project folder
cd vDexNode-GUI
# Install dependencies
# if you are using YARN
yarn
#if you are using NPM
npm install
```

## Usage

### Fill the .env file
You can just copy the `.env.template` file in the root folder and rename it to `.env` file.
```bash
NODES_API=http://95.216.0.79:9080
INSTALLER=https://raw.githubusercontent.com/Volentix/vDexNode-GUI/master/ubuntu-installer/install.sh
README=https://github.com/Volentix/vDexNode/blob/master/README.md
NODE_WAY=readme

#NODE_WAY=installer

# mainnet endpoint
EOS_ENDPOINT=https://eos.greymass.com

# testnet endpoint
# EOS_ENDPOINT=https://api.kylin.alohaeos.com
```

### Running
```bash
# Go to the project folder if you're not there
cd vDexNode-GUI
# Run the app
quasar dev -m electron
```

### Lint the files
```bash
yarn run lint
```

### Build
If you have all the certificates installed in your system, you can build the binaries for several platforms.
```bash
yarn run build # build for current user electron platform
yarn run build-all # build for all electron platforms linux|mac|windows|darwin
yarn run publish # Build for all electron platforms and upload is a release on github
```