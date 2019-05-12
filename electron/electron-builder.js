
module.exports = {
  appId: 'com.breadsplit.electron',
  productName: 'BreadSplit',
  copyright: 'Copyright © 2019 The BreadSplit Team',
  directories: {
    buildResources: 'static',
  },
  files: [
    {
      from: '.',
      to: '.',
      filter: [
        'package.json',
        'main.js',
      ],
    },
    {
      from: '../client/dist/',
      to: 'dist',
      filter: [
        '**/*',
      ],
    },
    {
      from: '..',
      to: '.',
      filter: [
        'LICENSE',
        'AUTHORS',
      ],
    },
  ],
  win: {
    target: 'nsis',
    icon: '../client/dist/favicon-194x194.png',
    publisherName: 'The BreadSplit Team',
  },
  // Windows installer
  nsis: {
    oneClick: true,
    deleteAppDataOnUninstall: true,
    createDesktopShortcut: true,
    uninstallDisplayName: 'Uninstall BreadSplit',
  },
}
