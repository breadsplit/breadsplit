export function getUserAgent() {
  return navigator.userAgent || navigator.vendor || ''
}

export function webviewName(userAgent?: string) {
  if (!userAgent)
    userAgent = getUserAgent()
  userAgent = userAgent.toLowerCase()

  if (userAgent.includes('micromessenger'))
    return 'wechat'

  if (userAgent.includes('alipay'))
    return 'alipay'

  if (userAgent.includes('line'))
    return 'line'

  if (userAgent.includes('fbav'))
    return 'facebook'

  if (userAgent.includes('instagram'))
    return 'instagram'

  if (userAgent.includes('pinterest'))
    return 'pinterest'

  if (userAgent.includes('twitter'))
    return 'twitter'

  if (userAgent.includes('webview') || userAgent.includes('wv'))
    return 'webview'

  return undefined
}
