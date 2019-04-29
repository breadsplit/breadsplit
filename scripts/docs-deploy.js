
const exec = require('exec-sh').promise;

(async () => {
  const cwd = { cwd: './docs/.vuepress/dist' }
  await exec('npm run docs:build')
  await exec('git init', cwd)
  await exec('git add -A', cwd)
  await exec('git commit -m "deploy"', cwd)
  await exec('git remote add origin https://github.com/antfu/splitoast', cwd)
  await exec('git push -f origin master:gh-pages', cwd)
})()

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
