module.exports = {
  appId: 'splitoast.electron',
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
      to: 'dist',
      filter: [
        'LICENSE',
      ],
    },
  ],
}