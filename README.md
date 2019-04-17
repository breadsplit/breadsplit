# MoneyFlow?

[📋**Stage Progress**](https://github.com/antfu/moneyflow/projects/1)

keywords: `split bills`, `group expenses management`, `sharing expenses`, `travel`

## Development

### Installation
1. Make sure you have [Node.js](https://nodejs.org/en/) > `v11.0` installed
2. Install [git](https://git-scm.com/) or GUI Clients (eg. [Github Desktop](https://desktop.github.com/))
3. [VSCode](https://code.visualstudio.com/) is recommend as text editor (with plugin [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) installed)
4. Chrome with extension [Vue.js DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) installed.
5. Clone this repo.
6. Install the dependencies using flowing command
``` bash
# install dependencies
$ npm ci
```

### Run the app

``` bash
# serve with hot reload at localhost:3000
$ npm run dev
```

### Build the app
```bash
# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

### Pull new code
```bash
$ git pull
```
After every pull, please run following command to ensure the packages dependencies
``` bash
$ npm i
```

## Tech-stacks / Docs

### Main

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


## Simliar Apps
- [Tricount](https://www.tricount.com/)
- [Splitwise](https://www.splitwise.com/)
- [SplittyPie](https://splittypie.com/) *Open Source*
- [KittySplit](https://www.kittysplit.com/en/)
- [iHateMoney](https://ihatemoney.org/)
- [Splid](https://splid.app/)