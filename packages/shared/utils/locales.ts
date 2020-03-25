import { AvaliableLocales, LocaleMessages } from '../../locales'
import { LOCALE_FALLBACK } from '../../utils/i18n'

export { AvaliableLocales, LocaleMessages as Messages }

export function getBrowserLanguage(): string {
  // @ts-ignore
  return window.navigator.language || window.navigator.userLanguage || ''
}

export function acceptLanguage(raw?: string) {
  if (!raw)
    raw = getBrowserLanguage()
  const fullcode = raw.trim().toLowerCase()
  const avaliable = AvaliableLocales.map(l => l.code)

  if (avaliable.includes(fullcode))
    return fullcode

  const halfcode = (fullcode.split('-')[0] || '').split('_')[0] || ''
  if (avaliable.includes(halfcode))
    return halfcode

  for (const code of avaliable) {
    if (code.startsWith(halfcode))
      return code
  }

  return LOCALE_FALLBACK
}
