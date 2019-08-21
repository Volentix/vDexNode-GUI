# Quasar App (vdexnode-gui)

A Quasar Framework app

## Install the dependencies

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

```

```bash
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

```bash
sudo apt update
```
```bash
sudo apt install yarn nodejs

```
```bash
yarn
```

```bash
sudo apt install npm

```
```bash
sudo npm install -g @quasar/cli

```
### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m electron
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
