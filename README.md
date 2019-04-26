# Splitoast ✂

[![CircleCI](https://circleci.com/gh/antfu/splitoast.svg?style=svg&circle-token=b26ce4526201e0c7fbeb42287d360930a69b3988)](https://circleci.com/gh/antfu/splitoast)
[![codecov](https://codecov.io/gh/antfu/splitoast/branch/master/graph/badge.svg?token=JRYbmADObn)](https://codecov.io/gh/antfu/splitoast)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d504cf88-4b12-4c3c-90a3-98e50a146df2/deploy-status)](https://app.netlify.com/sites/splitoast/deploys)

[📋 **Stage Progress**](https://github.com/antfu/splitoast/projects/1)

🔑 **Keywords**: `split bills`, `group expenses management`, `sharing expenses`, `accounting`

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

1. Make sure you have [Node.js](https://nodejs.org/en/) > `v11.0` installed
2. Install [git](https://git-scm.com/) or GUI Clients (eg. [Github Desktop](https://desktop.github.com/))
3. [VSCode](https://code.visualstudio.com/) is recommend as text editor ([**Recommend Plugins**](/docs/vscode-plugins.md))
4. Chrome with extension [Vue.js DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) installed.
5. Clone this repo.
6. Install the dependencies using flowing command

```sh
# install dependencies
$ npm ci
```

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

## 🛸 Tech-stacks / Docs

### Main

- [Typescript](https://www.typescriptlang.org/) (Main language)
  - [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
- [Vue.js](https://vuejs.org/) (Front-end framework)
  - [Vuetify](https://vuetifyjs.com/) (Vue UI Components)
  - [Vuex](https://vuex.vuejs.org/) (Vue state management)
    - [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate) (Store Vuex into LocalStorage)
  - [Vue i18n](http://kazupon.github.io/vue-i18n/) (i18n multi languages support)
- [Nuxt.js](https://nuxtjs.org/) (Tool set for Vue.js)
- [Express.js](https://expressjs.com/) (API routing)
  - [RESTful API](https://www.restapitutorial.com/) (Format standard for HTTP requests)
  - [axois](https://github.com/axios/axios) (HTTP client)
- [MongoDB](https://www.mongodb.com/) (Database)
  - [Mongoose](https://mongoosejs.com/) (JS driver for MongoDB)

### Preprocessors

- [Pug.js](https://pugjs.org/api/getting-started.html) *formly Jade* (HTML)
  - [HTML to Pug](https://html2jade.org/) (Tools)
- [Stylus](http://stylus-lang.com/) (CSS)

### Others

- [Material Design Icons](https://materialdesignicons.com/) (Icon set)
