import sha256 from 'crypto-js/sha256'

export default function randomstr(length = 16, key = Math.random()) {
  let str = ''
  while (str.length <= length)
    str += sha256(key.toString()).toString()
  return str.slice(0, length)
}

export const GenerateId = {
  LocalGroup: () => `lg-${randomstr(5)}`,
  OnlineGroup: () => `og-${randomstr(16)}`,
  Transaction: () => `t-${randomstr(16)}`,
  LocalMember: () => `lm-${randomstr(10)}`,
}
