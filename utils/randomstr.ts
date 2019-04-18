import sha256 from 'crypto-js/sha256'

export default function randomstr(length = 16, key = Math.random()) {
  let str = ''
  while (str.length <= length)
    str += sha256(key.toString()).toString()
  return str.slice(0, length)
}
