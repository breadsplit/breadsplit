import { Dayjs } from 'dayjs'
import dayjs from './dayjs_config'

type Time = string | number | Dayjs | Date

export function dateFromNow(time: Time) {
  return dayjs(time).fromNow()
}

export function dateToRelative(time: Time) {
  const d = dayjs(time)
  const days = dayjs().diff(d, 'day')
  if (days === 0)
    return 'Today' // TODO: i18n
  if (days === 1)
    return 'Yesterday'

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
