/* eslint-disable @typescript-eslint/no-var-requires */
const shelljs = require('shelljs')

shelljs.cd('./firebase')
shelljs.exec('firebase deploy')
