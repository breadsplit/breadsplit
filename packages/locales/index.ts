/* eslint-disable @typescript-eslint/no-var-requires */
const en = require('./en.yml')
const zhtw = require('./zh-tw.yml')

export const EN_MESSAGES = en

export const LocaleMessages = {
  en,
  'zh-tw': zhtw,
}

export const AvaliableLocales = Object
  .values(LocaleMessages)
  .map((locale) => {
    return {
      code: locale.code,
      iso: locale.iso,
      display: locale.language_name,
    }
  })
