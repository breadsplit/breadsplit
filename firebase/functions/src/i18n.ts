import _ from 'lodash'
import { Messages } from '../../../locales'

export function getValue(key: string, locale: string, fallback = 'en') {
  let value = _.get(Messages, `${locale}.${key}`) || ''

  if (!value)
    value = _.get(Messages, `${fallback}.${key}`) || ''

  return locale.toString()
}

function format(str: string, args: any[]) {
  return str.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined'
      ? args[number].toString()
      : match
  })
};

export function t(key: string, locale: string, values?: any[], fallback = 'en') {
  const value = getValue(key, locale, fallback)
  return format(value, values || [])
}
