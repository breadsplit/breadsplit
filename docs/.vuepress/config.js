module.exports = {
  title: 'Splittable',
  description: '',
  serviceWorker: true,
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'theme-color', content: '#41b883' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  ],
  themeConfig: {
    repo: 'antfu/moneyflow',
    docsRepo: 'antfu/moneyflow',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Contribute', link: '/contribute' },
      { text: 'Reveal', link: '/reveal' }
    ],
    sidebar: [
      '/',
      {
        title: 'Contribute',
        collapsable: false,
        children: [
          'contribute/dev-environment',
          'contribute/vscode-plugins',
        ]
      },
    ]
  }
}
