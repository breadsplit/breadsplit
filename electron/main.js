/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const path = require('path')
const { app, BrowserWindow } = require('electron')
const serve = require('electron-serve')

const serving = serve({ directory: 'dist' })

let win = null

const newWin = () => {
  win = new BrowserWindow({
    icon: path.join(__dirname, 'dist/favicon.png'),
  })
  win.on('closed', () => {
    win = null
    app.quit()
  })

  return serving(win)
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
