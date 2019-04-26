# ✂ Splitoast 🍞

[![CircleCI](https://circleci.com/gh/antfu/splitoast.svg?style=svg&circle-token=b26ce4526201e0c7fbeb42287d360930a69b3988)](https://circleci.com/gh/antfu/splitoast)
[![codecov](https://codecov.io/gh/antfu/splitoast/branch/master/graph/badge.svg?token=JRYbmADObn)](https://codecov.io/gh/antfu/splitoast)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d504cf88-4b12-4c3c-90a3-98e50a146df2/deploy-status)](https://app.netlify.com/sites/splitoast/deploys)

[📋 **Stage Progress**](https://github.com/antfu/splitoast/projects/1)

🔑 **Keywords**: `split bills`, `group expenses management`, `sharing expenses`, `accounting`

## Key Features

`Further discussion required`

## Simliar Apps 🚗🚓🚕🚙

- [Settle Up⭐](https://www.tricount.com/)
- [Splitwise⭐](https://www.splitwise.com/)
- [Splid⭐](https://splid.app/)
- [Tricount](https://www.tricount.com/)
- [SplittyPie](https://splittypie.com/) *Open Source*
- [KittySplit](https://www.kittysplit.com/en/)
- [iHateMoney](https://ihatemoney.org/)
- [Acasa](https://www.helloacasa.com/)
- [Spend Together](https://itunes.apple.com/us/app/spend-together/id1446549608?mt=8)

## Development

### 💽 Installation

1. Install [Node.js](https://nodejs.org/en/) > `v11.0`
1. Install [git](https://git-scm.com/) or GUI Clients (eg. [Github Desktop](https://desktop.github.com/))
1. Clone this repo.
1. Install dependencies using flowing command

```sh
$ git checkout dev
$ npm ci
```

#### Optional Tools

- [VSCode](https://code.visualstudio.com/) is recommend as text editor ([**Recommend Plugins**](/contribute/vscode-plugins.md))
- Chrome extension [Vue.js DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

### 🚀 Run the app

```sh
# serve with hot reload at localhost:3000
$ npm run dev
```

### 📦 Build the app (Production)

```sh
# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

### ☄ Pull new code

```sh
$ git pull
```

After every pull, please run following command to ensure the packages dependencies

```sh
$ npm i
```

## 🗻 Roadmap

[**Stage Progress**](https://github.com/antfu/splitoast/projects/1)

### ✈ Stage 1 Prototyping & Basic Implementation

- Name and Logo
- Overall UI style
- Cross compare other apps
- Functions & Features directions
- Implement offline features
- PWA Support
- UI implement

### Stage 2 Preparation for Public

- i18n support (English and Chinese)
- Basic privacy policy and terms of services
- Source code license
- Contribution guildline
- Create a Github team and make the repo **public**
- Donate channel (Patreon or Open Collective)
- Web home page for introduction
- Make promptions on PTT, Dcard, etc

### Stage 3 Online Support

- Implement online features
- [Web push notification](https://developers.google.com/web/fundamentals/push-notifications/)
- Server and database (Try [Firebase](https://firebase.google.com/))
- API docs for community support
- Online payments integration for settling up (Paypal, LINE Pay, Wechat Pay, Alipay, etc.)

### Stage 4 Multi Platform

- Android/iOS
  1. Simple wrapper
  2. Connect with native functions ([Google NearBy](https://developers.google.com/nearby/messages/overview), Native notifications, etc.)
- [Electron](https://electronjs.org/) (Windows/MacOS/Linux)
- Automatic build

## 🛸 Tech-stacks / Docs

### Main

- [Typescript](https://www.typescriptlang.org/) (Main language)
  - [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
  - [vuex-class](https://github.com/ktsn/vuex-class)
- [Vue.js](https://vuejs.org/) (Front-end framework)
  - [Vuetify](https://vuetifyjs.com/) (Vue UI Components)
  - [Vuex](https://vuex.vuejs.org/) (Vue state management)
    - [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate) (Store Vuex into LocalStorage)
  - [Vue i18n](http://kazupon.github.io/vue-i18n/) (i18n multi languages support)
- [Nuxt.js](https://nuxtjs.org/) (Tool set for Vue.js)

### Preprocessors

- [Pug.js](https://pugjs.org/api/getting-started.html) *formerly Jade* (HTML)
  - [HTML to Pug](https://html2jade.org/) (Tools)
- [Stylus](http://stylus-lang.com/) (CSS)

### Others

- [Material Design Icons](https://materialdesignicons.com/) (Icon set)
