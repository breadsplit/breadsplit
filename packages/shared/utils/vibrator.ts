export function Vibrate (duration = 100) {
  if (window.navigator && window.navigator.vibrate)
    window.navigator.vibrate(duration)
}
