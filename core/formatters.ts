import { Dayjs } from 'dayjs'
import dayjs from './dayjs_config'
import { Translator, t } from './i18n'

type Time = string | number | Dayjs | Date

export function dateFromNow(time: Time) {
  const d = dayjs(time)
  const now = dayjs()
  if (now.diff(d, 'day') >= 1)
    return d.format('ll')
  return d.fromNow()
}

export function dateToRelative(time: Time, $t: Translator = t, locale?: string) {
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

export function capitalizeEachWords(s: string, divider = ' ') {
  return s.split(divider).map(w => capitalize(w)).join(divider)
}
