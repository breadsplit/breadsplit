import en from './en'
import zhcn from './zh-cn'
import zhtw from './zh-tw'

const Locales = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: [
    { code: 'en', iso: 'en-US', display: 'English' },
    { code: 'zh-tw', iso: 'zh-TW', display: '繁體中文' },
    // Temporary disable zh-cn during developing
    // { code: 'zh-cn', iso: 'zh-CN', display: '简体中文' },
  ],
  messages: {
    en,
    'zh-cn': zhcn,
    'zh-tw': zhtw,
  },
}

export default Locales

export function acceptLanguages(raw:string):string {
  const fullcode = raw.trim().toLowerCase()
  const avaliable = Locales.locales.map(l => l.code)
  if (avaliable.indexOf(fullcode) > -1)
    return fullcode
  const halfcode = (fullcode.split('-')[0] || '').split('_')[0] || ''
  if (avaliable.indexOf(halfcode) > -1)
    return halfcode
  for (const code of avaliable) {
    if (code.startsWith(halfcode))
      return code
  }
  return 'en'
}
