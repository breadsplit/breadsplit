import VueI18n from 'vue-i18n'
import en from './en.json'
import zhcn from './zh-cn.json'
import zhtw from './zh-tw.json'
import fr from './fr.json'
import ja from './ja.json'

export const Messages = {
  en,
  fr,
  ja,
  'zh-cn': zhcn,
  'zh-tw': zhtw,
}

export const AvaliableLocales = Object
  .values(Messages)
  .map((locale) => {
    return {
      code: locale.code,
      iso: locale.iso,
      display: locale.language_name,
    }
  })

export function CreateVueI18n(Vue: any, defaultLocale: string) {
  Vue.use(VueI18n)
  return new VueI18n({
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: Messages,
    silentFallbackWarn: true,
  })
}
