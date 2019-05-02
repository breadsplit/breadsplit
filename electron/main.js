/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const path = require('path')
const http = require('http')
const { app, BrowserWindow } = require('electron')
const express = require('express')

const appServer = express()
const dist = path.join(__dirname, 'dist')
const port = 9012
appServer.use(express.static(path.join(dist, '')))

appServer.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

function start() {
  let win = null

  const newWin = () => {
    win = new BrowserWindow({
      icon: path.join(__dirname, 'dist/favicon.png'),
    })
    win.on('closed', () => {
      win = null
      app.quit()
    })

    if (process.env.NODE_ENV !== 'production')
      win.webContents.openDevTools()
    return win.loadURL(`http://localhost:${port}`)
  }

  app.on('ready', newWin)
  app.on('window-all-closed', () => app.quit())
  app.on('activate', () => win === null && newWin())
}

http.createServer(appServer).listen(port, () => {
  start()
})
