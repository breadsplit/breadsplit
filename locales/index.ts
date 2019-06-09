/* eslint-disable @typescript-eslint/no-var-requires */
const en = require('./en.yml')
const zhcn = require('./zh-cn.yml')
const zhtw = require('./zh-tw.yml')
const fr = require('./fr.yml')
const ja = require('./ja.yml')
const de = require('./de.yml')

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
