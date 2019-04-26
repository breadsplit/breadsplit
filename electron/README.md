# Splitoast Electron

The electron building scripts for [Splitoast](https://github.com/antfu/splitoast)

## Install & build

Install the dependencies

```sh
cd ./splitoast-electron
npm ci
```

Build the electron app

```sh
npm run build
```

## Development

Inside `./splitoast-electron`:

```sh
npm run dev
```

## TODO

- Locales
- Version update from main repo
- [IPC Messaging](https://electronjs.org/docs/api/ipc-main)
- Custom menu bar
- Config for MacOS and Linux
- Tests
- Publish the app