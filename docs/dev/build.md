# 📦 Production Build

## Web

This command will build static web files under `client/dist`.

```bash
# switch to dev branch
$ git checkout dev

# generate static project
$ npm run generate
```

## Electron (💻Desktop)

Install the dependencies

```bash
$ npm run electron:install
```

Pack to a executable setup

```bash
$ npm run electron:build
```

The `.exe` or `.dmg` file will located under `electron/dist`.

For more details, please check [Electron](https://electronjs.org/)

## Cordova (📱Android/iOS)

Install the dependencies

```bash
# install dependencies
$ npm run cordova:install

# cordova initialize
$ npm run cordova:prepare
```

Check the [requirements](https://cordova.apache.org/docs/en/latest/guide/cli/index.html#install-pre-requisites-for-building)

```bash
$ npm run cordova:check
```

Build into app

```bash
$ npm run cordova:build
```

For more details, please check [Cordova](https://cordova.apache.org/docs/en/latest)