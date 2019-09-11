// check if the browser is compatible
export function isCompat () {
  try {
    if (!Intl)
      return false

    return true
  }
  catch (error) {
    return false
  }
}
