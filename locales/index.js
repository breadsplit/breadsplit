import en from './en'
import zhcn from './zh-cn'
import zhtw from './zh-tw'

export default {
  locales: [
    { code: 'en', iso: 'en-US', display: 'English' },
    { code: 'zh-cn', iso: 'zh-CN', display: '简体中文' },
    { code: 'zh-tw', iso: 'zh-TW', display: '繁體中文' },
  ],
  defaultLocale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-cn': zhcn,
    'zh-tw': zhtw,
  },
}
