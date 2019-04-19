import en from './messages/en'
import zhcn from './messages/zh-cn'
import zhtw from './messages/zh-tw'

export const AvaliableLocales = [
  { code: 'en', iso: 'en-US', display: 'English' },
  { code: 'zh-tw', iso: 'zh-TW', display: '繁體中文' },
  // Temporary disable zh-cn during developing
  // { code: 'zh-cn', iso: 'zh-CN', display: '简体中文' },
]

export const Messages = {
  en,
  'zh-cn': zhcn,
  'zh-tw': zhtw,
}

export const Config = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: AvaliableLocales,
  messages: Messages,
}

export function AcceptLanguage(raw: string) {
  const fullcode = raw.trim().toLowerCase()
  const avaliable = AvaliableLocales.map(l => l.code)
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
