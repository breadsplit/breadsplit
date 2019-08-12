import get from 'lodash/get'
import { Messages } from '../locales'

export const LOCALE_FALLBACK = 'en'

export function getValue (key: string, locale: string, fallback = LOCALE_FALLBACK) {
  let value = get(Messages, `${locale}.${key}`) || ''

  if (!value)
    value = get(Messages, `${fallback}.${key}`) || ''

  return value.toString()
}

function format (str: string, args: any[]) {
  return str.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined'
      ? args[number].toString()
      : match
  })
};

export function t (key: string, locale: string = LOCALE_FALLBACK, values?: any[], fallback = LOCALE_FALLBACK) {
  const value = getValue(key, locale, fallback)
  return format(value, values || [])
}

export type Translator = (key: string, locale?: string, args?: any[]) => any
