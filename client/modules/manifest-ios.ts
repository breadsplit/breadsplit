import NuxtConfiguration from '@nuxt/config'

/* this is a workaround for ios home app
  details refer to https://github.com/firebase/firebase-js-sdk/issues/77
  and https://stackoverflow.com/a/52286655
*/
export default function (this: {options: NuxtConfiguration}) {
  if (!this.options.head)
    this.options.head = {}

  if (!this.options.head.link)
    this.options.head.link = []

  const manifestLink = this.options.head.link.find(l => l.rel === 'manifest')

  if (!manifestLink)
    return

  const manifestHref = manifestLink.href

  this.options.head.link.push({
    rel: 'pwa-setup',
    href: manifestHref,
  })

  if (!this.options.head.script)
    this.options.head.script = []

  this.options.head.script.push({ src: 'pwacompat.js', type: 'text/javascript', charset: 'utf-8' })
  this.options.head.script.push({
    type: 'text/javascript',
    charset: 'utf-8',
    innerHTML: 'if(/iPhone|iPod/.test(navigator.platform||"")) document.querySelector(\'link[rel="manifest"]\').setAttribute("rel", "no-on-ios")',
  })

  // this allows script innerHTML to be parsed properly
  this.options.head.__dangerouslyDisableSanitizers = ['script']
}
