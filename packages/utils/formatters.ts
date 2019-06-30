import dayjs from '../core/dayjs_config'
import { Translator, t } from './i18n'

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function dateFromNow(time: dayjs.ConfigType, locale: string) {
  const d = dayjs(time)
  const now = dayjs()
  if (now.diff(d, 'year') >= 1)
    return d.toDate().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'long' })
  if (now.diff(d, 'day') >= 1)
    return d.toDate().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })
  return d.fromNow()
}

export function getWeekOfYear(time: dayjs.ConfigType) {
  const d = dayjs(time)

  // ISO 8601 states that week 1 is the week
  // with january 4th in it
  const jan4 = d.set('month', 1).set('day', 4)

  const start = jan4.startOf('week')

  const now = d.startOf('week')

  return now.diff(start, 'week')
}

export function dateToRelative(time: dayjs.ConfigType, $t: Translator = t, locale?: string) {
  const d = dayjs(time)
  const days = dayjs().diff(d, 'day')
  if (days === 0)
    return $t('noun.today', locale).toString()
  if (days === 1)
    return $t('noun.yesterday', locale).toString()

  // refer to https://github.com/iamkun/dayjs/blob/dev/docs/en/Plugin.md#localizedformat
  return d.format('ll')
}

export function numberToMoney(value: number, locale: string = 'en', currency?: string, digits = 2) {
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
