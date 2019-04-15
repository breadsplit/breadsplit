import en from './en'
import zhcn from './zh-cn'
import zhtw from './zh-tw'

export default {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: [
    { code: 'en', iso: 'en-US', display: 'English' },
    { code: 'zh-tw', iso: 'zh-TW', display: '繁體中文' },
    // Templorary disable zh-cn to reduce disturbation during developmenting
    // { code: 'zh-cn', iso: 'zh-CN', display: '简体中文' },
  ],
  messages: {
    en,
    'zh-cn': zhcn,
    'zh-tw': zhtw,
  },
}
