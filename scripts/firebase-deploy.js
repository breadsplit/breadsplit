/* eslint-disable @typescript-eslint/no-var-requires */
const shelljs = require('shelljs')

shelljs.cd('./packages/firebase')
shelljs.exec('firebase deploy --project=default')
