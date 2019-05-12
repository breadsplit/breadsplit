/* eslint-disable @typescript-eslint/no-var-requires, no-console */

const path = require('path')
const http = require('http')
const { exec } = require('child_process')
const electron = require('electron')
const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')

const root = '../breadsplit'
const port = 3000 || process.env.NUXT_PORT || process.env.PORT

const child = exec(`npm run dev --prefix=${root}`)
const _NUXT_URL_ = `http://localhost:${port}`

let win = null // Current window
const app = electron.app

const newWin = () => {
  win = new electron.BrowserWindow({
    icon: path.join(root, 'static/favicon-194x194.png'),
  })

  // win.maximize()
  win.on('closed', () => {
    win = null
  })

  // Install vue dev tool and open chrome dev tools
  installExtension(VUEJS_DEVTOOLS.id)
    .then((name) => {
      console.log(`Added Extension:  ${name}`)
      // win.webContents.openDevTools()
    })
    .catch((err) => {
      console.log('An error occurred: ', err)
    })

  // Wait for nuxt to build
  const pollServer = () => {
    http.get(_NUXT_URL_, (res) => {
      if (res.statusCode === 200)
        win.loadURL(_NUXT_URL_)
      else
        setTimeout(pollServer, 300)
    }).on('error', pollServer)
  }
  pollServer()
}

app.on('ready', newWin)
app.on('window-all-closed', () => {
  app.quit()
  child.kill()
})
app.on('activate', () => win === null && newWin())
