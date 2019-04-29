module.exports = {
  title: 'Splitoast Develop',
  description: '',
  serviceWorker: true,
  base: '/splitoast/',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'theme-color', content: '#41b883' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  ],
  themeConfig: {
    repo: 'antfu/splitoast',
    docsRepo: 'antfu/splitoast',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Setup', link: '/setup/env-setup' },
    ],
    sidebar: [
      '/',
      {
        title: 'Setup',
        collapsable: false,
        children: [
          'setup/env-setup',
          'setup/launch',
        ]
      },
      {
        title: 'Contribute',
        collapsable: false,
        children: [
          'contribute/commit-message-guideline',
        ]
      },
      {
        title: 'Client API',
        collapsable: false,
        children: [
          'client_api/store',
        ]
      },
      {
        title: 'Server API',
        collapsable: false,
        children: []
      },
    ]
  }
}
