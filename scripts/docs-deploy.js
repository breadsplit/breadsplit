
const shelljs = require('shelljs')

shelljs.exec('npm run docs:build')
shelljs.cd('./docs/.vuepress/dist')
shelljs.exec('git init')
shelljs.exec('git add -A')
shelljs.exec('git commit -m "docs:deploy [ci skip]"')
shelljs.exec('git remote add origin https://github.com/antfu/splitoast')
shelljs.exec('git push -f origin master:gh-pages')

/*
#!/usr/bin/env sh

# abort on errors
set -e

npm run docs:build

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:antfu/splitoast.git master:gh-pages

cd -
*/
