import en from './en.json'
import zhcn from './zh-cn.json'
import zhtw from './zh-tw.json'
import fr from './fr.json'
import ja from './ja.json'
import de from './de.json'

export const EN_MESSAGES = en

export const Messages = {
  en,
  fr,
  ja,
  'zh-cn': zhcn,
  'zh-tw': zhtw,
  de,
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
