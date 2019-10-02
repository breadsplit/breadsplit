import get from 'lodash/get'
import { LocaleMessages } from '../locales'

export const LOCALE_FALLBACK = 'en'

export function getValue (key: string, locale: string, fallback = LOCALE_FALLBACK) {
  let value = get(LocaleMessages, `${locale}.${key}`) || ''

  if (!value)
    value = get(LocaleMessages, `${fallback}.${key}`) || ''

  return value.toString()
}

export function t (key: string, locale: string = LOCALE_FALLBACK, args?: any[] | Record<string, any>, fallback = LOCALE_FALLBACK) {
  const value = getValue(key, locale, fallback)
  if (!args)
    return value
  return value.replace(/{([\d\w]+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined'
      ? args[number].toString()
      : match
  })
}

export type PlainTranslator = (key: string, locale?: string, args?: any) => any
export type Translator = (key: string, args?: any) => any

export function makeTranslator (t: PlainTranslator, locale: string = LOCALE_FALLBACK) {
  return (key: string, args?: any) => t(key, locale, args).toString()
}
