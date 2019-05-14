// This plugin is now broken because a bug of nuxt
// details:
// https://github.com/nuxt/nuxt.js/issues/4491

import { getWebviewType } from '~/utils/ua'
import { Context } from '@nuxt/vue-app'

export default ({ route, app }: Context) => {
  const webview = getWebviewType()
  const path = route.fullPath.slice(2) // remove the leading '/#' in the path
  const blocked = path.startsWith('/webview_blocker')

  // most of cast, the blocker is skipped
  if (!webview && !blocked)
    return

  // webview detected and already blocked
  if (webview && blocked)
    return

  const queryString = path.slice(path.indexOf('?') || 0)
  const query = new URLSearchParams(queryString)
  // @ts-ignore
  const redirect = app.router.push

  // webview detected
  if (webview && !blocked)
    redirect(`/webview_blocker?from=${path}`)

  // blocker resloved, redirect back to original page
  if (!webview && blocked)
    redirect(query.get('from') || '/')
}
