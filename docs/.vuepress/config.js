module.exports = {
  title: '🍞 BreadSplit Developer',
  description: 'Group bills split made easy, fast and customizable.',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'theme-color', content: '#41b883' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  ],
  ga: process.env.GOOGLE_GTAG_ID,
  themeConfig: {
    repo: 'antfu/breadsplit',
    docsRepo: 'antfu/breadsplit',
    docsDir: 'docs',
    docsBranch: 'master',
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Live', link: 'https://app.breadsplit.com/' },
    ],
    sidebar: {
      '/': [
        {
          title: 'Guides',
          collapsable: false,
          children: [
            'guide/extra_guide_zh',
          ],
        },
        {
          title: 'Development',
          collapsable: false,
          children: [
            'dev/setup',
            'dev/launch',
            'dev/dirs',
            'dev/tech',
            'dev/env',
            'dev/build',
            'dev/test',
          ]
        },
        {
          title: 'Contribute',
          collapsable: false,
          children: [
            'contribute/guideline',
            'contribute/translate',
          ]
        },
        {
          title: 'About',
          collapsable: false,
          children: [
            'about/roadmap',
            'about/team',
            'about/license',
          ]
        },
      ]
    },
    '/api': [
      {
        title: 'API',
        collapsable: false,
        children: [
          'api/store',
        ]
      },
    ]
  }
}
