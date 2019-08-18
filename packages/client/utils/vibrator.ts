export function Vibrate (feq = 200) {
  if (window.navigator && window.navigator.vibrate)
    window.navigator.vibrate(feq)
}
