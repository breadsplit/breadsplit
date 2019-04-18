import sha256 from 'crypto-js/sha256'

export default function randomstr(length = 16, seed = +new Date()) {
  let str = ''
  while (str.length <= length)
    str += sha256(seed.toString()).toString()
  return str.slice(0, length)
}
