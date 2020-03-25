import dayjs from '../core/dayjs_config'
import { t, LOCALE_FALLBACK, PlainTranslator } from './i18n'

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function dateFromNow(time: dayjs.ConfigType, locale: string = LOCALE_FALLBACK) {
  const d = dayjs(time)
  const date = d.toDate() || new Date()
  const now = dayjs()
  if (now.diff(d, 'year') >= 1)
    return date.toLocaleDateString(locale || LOCALE_FALLBACK, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  if (now.diff(d, 'day') >= 1)
    return date.toLocaleDateString(locale || LOCALE_FALLBACK, { weekday: 'long', month: 'long', day: 'numeric' })
  return d.fromNow()
}

export function shortDate(locale: string, time: dayjs.ConfigType, relatedTo?: dayjs.ConfigType) {
  const d = dayjs(time)
  const date = d.toDate() || new Date()
  if (dayjs(relatedTo).year() === d.year())
    return date.toLocaleDateString(locale || LOCALE_FALLBACK, { month: 'short', day: 'numeric' })
  else
    return date.toLocaleDateString(locale || LOCALE_FALLBACK, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function shortDateMonth(locale: string, time: dayjs.ConfigType, relatedTo?: dayjs.ConfigType) {
  const d = dayjs(time)
  const date = d.toDate() || new Date()
  if (dayjs(relatedTo).year() === d.year())
    return date.toLocaleDateString(locale || LOCALE_FALLBACK, { month: 'long' })
  else
    return date.toLocaleDateString(locale || LOCALE_FALLBACK, { month: 'long', year: 'numeric' })
}

export function getWeekOfYear(time: dayjs.ConfigType) {
  const d = dayjs(time)

  // ISO 8601 states that week 1 is the week
  // with january 4th in it
  // const jan4 = d.set('month', 1).set('day', 4)

  const start = d.startOf('year').startOf('week')

  const now = d.startOf('week')

  return now.diff(start, 'week')
}

export function dateToRelative(time: dayjs.ConfigType, $t: PlainTranslator = t, locale?: string) {
  const d = dayjs(time)
  const days = dayjs().diff(d, 'day')
  if (days === 0)
    return $t('noun.today', locale).toString()
  if (days === 1)
    return $t('noun.yesterday', locale).toString()

  // refer to https://github.com/iamkun/dayjs/blob/dev/docs/en/Plugin.md#localizedformat
  return d.format('ll')
}

export function numberToMoney(value: number, locale: string = LOCALE_FALLBACK, currency?: string, digits = 2) {
  const formatter = new Intl.NumberFormat(locale, {
    style: currency ? 'currency' : undefined,
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatter.format(value)
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function capitalizeEachWords(s: string, delimiter = ' ') {
  return s.split(delimiter).map(w => capitalize(w)).join(delimiter)
}

export function formatExchangeDate(d?: dayjs.ConfigType) {
  return dayjs(d).format('YYYY-MM-DD')
}
