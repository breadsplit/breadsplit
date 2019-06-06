module.exports = {
  links: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/img/logo/touch-icon.png',
      media: '(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
    },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/logo/favicon32.png' },
    { rel: 'icon', type: 'image/png', sizes: '194x194', href: '/img/logo/favicon.png' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/logo/appicon192.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/logo/favicon16.png' },
    {
      async: true,
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
    },
    {
      async: true,
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.6.95/css/materialdesignicons.css',
    },
  ],
}
