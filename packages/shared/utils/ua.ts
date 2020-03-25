/* spell-checker: disable */

/* Details refer to
  https://developers.whatismybrowser.com/useragents/explore/
  https://developer.chrome.com/multidevice/user-agent
*/

export function getUserAgent() {
  return navigator.userAgent || navigator.vendor || ''
}

const UA = (userAgent?: string) => {
  let ua: string
  if (!userAgent)
    ua = getUserAgent().toLocaleLowerCase()
  else
    ua = userAgent.toLocaleLowerCase()

  return {
    oneOf(...condictions: string[]) {
      for (const cond of condictions) {
        if (ua.includes(cond))
          return true
      }
      return false
    },
  }
}

export type WebviewType = 'wechat' | 'alipay' | 'line' | 'facebook' | 'instagram' | 'pinterest' | 'twitter' | 'webview' | undefined
export type OSType = 'android' | 'windows' | 'linux' | 'ios' | 'macos' | 'other'

export function getWebviewType(userAgent?: string): WebviewType {
  const ua = UA(userAgent)

  if (ua.oneOf('micromessenger'))
    return 'wechat'

  if (ua.oneOf('alipay'))
    return 'alipay'

  if (ua.oneOf('line'))
    return 'line'

  if (ua.oneOf('fbav'))
    return 'facebook'

  if (ua.oneOf('instagram'))
    return 'instagram'

  if (ua.oneOf('pinterest'))
    return 'pinterest'

  if (ua.oneOf('twitter'))
    return 'twitter'

  if (ua.oneOf('webview', 'wv'))
    return 'webview'

  return undefined
}

export function getOSType(userAgent?: string): OSType {
  const ua = UA(userAgent)

  if (ua.oneOf('android'))
    return 'android'

  if (ua.oneOf('windows'))
    return 'windows'

  if (ua.oneOf('linux', 'ubuntu'))
    return 'linux'

  if (ua.oneOf('iphone', 'ipad'))
    return 'ios'

  if (ua.oneOf('mac os', 'macintosh'))
    return 'macos'

  return 'other'
}

export function isStandalone(): boolean {
  try {
    // @ts-ignore
    return window.navigator.standalone === true // iOS
    || window.matchMedia('(display-mode: standalone)').matches // Android
  }
  catch (e) {
    return false
  }
}
