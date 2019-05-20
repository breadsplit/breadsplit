# 📂 Directory Structure

    .
    ├── ...
    ├── client              # The main code, web pages based on Nuxt.js
    |   ├── assets              # Images, fonts, styles and other assets
    |   ├── components          #⭐Vue components
    |   ├── layouts             # Nuxt.js layouts
    |   ├── meta                # Built-in data set
    |   ├── middleware          # Nuxt.js routing middlewares
    |   ├── mixins              # Vue mixins for code reuse
    |   ├── pages               #⭐Nuxt.js pages, will be served with same directory structure
    |   ├── plugins             # Nuxt.js plugins
    |   ├── static              # Will be copied to root of the website
    |   ├── store               #⭐Vuex store
    |   ├── ...
    |   └── nuxt.config.ts      # Nuxt.js config file
    ├── core                #⭐Core logic of BreadSplit, shared both in client and server
    ├── cypress             # End-to-end test Cypress
    ├── firebase            #⭐Server functions and rules
    ├── types               # Typescript types
    ├── locales             #🌎i18n texts
    ├── docs                #📕For generating documentation website in the future
    ├── electron            #💻Electron build scripts and platform specify code
    ├── scripts             # Scripts helps to manage this project
    ├── LICENSE
    ├── ...
    └── README.md

`⭐: Important`
