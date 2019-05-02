module.exports = {
  title: '🍞 Splitoast Develop',
  description: 'Group bills split made easy, fast and customizable.',
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
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Live', link: 'https://splitoast.netlify.com/' },
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
            'dev/env-setup',
            'dev/launch',
            'dev/dirs',
            'dev/tech',
            'dev/build',
          ]
        },
        {
          title: 'Contribute',
          collapsable: false,
          children: [
            'contribute/guideline',
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
