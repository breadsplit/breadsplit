export default function FontFamilyBuilder(font_of_locale) {
  let font = font_of_locale.trim().trim(',')
  if (font)
    font += ','
  return `Roboto, ${font} "Helvetica Neue", Verdana, Arial, sans-serif !important`
}
