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
