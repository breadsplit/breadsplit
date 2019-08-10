export function hashCode (s: string) {
  const l = s.length
  let h = 0
  let i = 0
  if (l > 0) {
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0
  }
  return h
}
