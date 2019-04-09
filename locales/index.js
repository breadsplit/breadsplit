import en from './en'
import zhcn from './zh-cn'
import zhtw from './zh-tw'

export default {
  locales: [
    { code: 'en', iso: 'en-US', display: 'English' },
    { code: 'zh-tw', iso: 'zh-TW', display: '繁體中文' },
    // Templorary disable zh-cn to reduce disturbation during developmenting
    // { code: 'zh-cn', iso: 'zh-CN', display: '简体中文' },
  ],
  defaultLocale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-cn': zhcn,
    'zh-tw': zhtw,
  },
}
