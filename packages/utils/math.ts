
export function GCD (arr: number[]) {
  // Use spread syntax to get minimum of array
  const lowest = Math.min(...arr)

  for (let factor = lowest; factor > 1; factor--) {
    let isCommonDivisor = true

    for (let j = 0; j < arr.length; j++) {
      if (arr[j] % factor !== 0) {
        isCommonDivisor = false
        break
      }
    }

    if (isCommonDivisor)
      return factor
  }

  return 1
}

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
