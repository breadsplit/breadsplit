import { getWebviewType } from '~/utils/ua'
import { Context } from '@nuxt/vue-app'

let checked = false

export default ({ route, redirect }: Context) => {
  // only run once
  if (checked)
    return
  checked = true

  const webview = getWebviewType()
  const path = route.path
  const blocked = path.startsWith('/webview_blocker')

  // most of cast, the blocker is skipped
  if (!webview && !blocked)
    return

  // webview detected and already blocked
  if (webview && blocked)
    return

  // webview detected
  if (webview && !blocked)
    redirect(`/webview_blocker?from=${path}`)

  // blocker resloved, redirect back to original page
  if (!webview && blocked)
    redirect((route.query.from || '/').toString())
}
