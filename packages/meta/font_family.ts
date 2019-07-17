import trim from 'lodash/trim'

export default function FontFamilyBuilder (font_of_locale: string) {
  let font = trim(font_of_locale.trim(), ',')
  if (font)
    font += ','
  return `Roboto, ${font} "Helvetica Neue", Verdana, Arial, sans-serif !important`
}
