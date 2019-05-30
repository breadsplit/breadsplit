# 🌿 Environment Variables

## Avaliable to setup

- `NODE_ENV` build mode, should be `development` or `production`
- `FIREBASE_SERVER` firebase server name to connect, should be `production`, `development` or `test`
- `RELEASE_CHANNEL` should be `stable`, `beta`, `alpha` or `dev`
- `BUILD_TARGET` target platform, should be `web` or `electron`,`android` or `ios`
- `GOOGLE_GTAG_ID` Google analytics tag.
- `SENTRY_DSN` Sentry.io DSN url

## Auto generated env

- `BUILD_TIME` ISO datetime string of current time on building
- `APP_VERSION` version from `package.json`
