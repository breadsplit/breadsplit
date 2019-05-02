import locales from '../locales'

export const AvaliableLocales = Object
  .values(locales)
  .map((locale) => {
    return {
      code: locale.code,
      iso: locale.iso,
      display: locale.language_name,
    }
  })

export const Messages = locales

export const Config = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: AvaliableLocales,
  messages: Messages,
}

export function AcceptLanguage(raw: string) {
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
