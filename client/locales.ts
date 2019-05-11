import { AvaliableLocales, Messages } from '../locales'

export { AvaliableLocales, Messages }

export function getBrowserLanguage(): string {
  // @ts-ignore
  return window.navigator.language || window.navigator.userLanguage || ''
}

export function acceptLanguage(raw?: string) {
  if (!raw)
    raw = getBrowserLanguage()
  const fullcode = raw.trim().toLowerCase()
  const avaliable = AvaliableLocales.map(l => l.code)
  if (avaliable.indexOf(fullcode) > -1)
    return fullcode
  const halfcode = (fullcode.split('-')[0] || '').split('_')[0] || ''
  if (avaliable.indexOf(halfcode) > -1)
    return halfcode
  for (const code of avaliable) {
    if (code.startsWith(halfcode))
      return code
  }
  return 'en'
}
