/* eslint-disable @typescript-eslint/no-var-requires */
const shelljs = require('shelljs')

shelljs.exec('npm run docs:build')
shelljs.cd('./docs/.vuepress/dist')
shelljs.exec('git init')
shelljs.exec('git add -A')
shelljs.exec('git commit -m "docs: deploy [ci skip]"')
shelljs.exec('git remote add origin https://github.com/antfu/splitoast')
shelljs.exec('git push -f origin master:gh-pages')
