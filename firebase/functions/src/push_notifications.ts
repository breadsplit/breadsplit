import * as admin from 'firebase-admin'
import _ from 'lodash'
import { ServerGroup } from '../../../types/models'

export async function PushGroupNotification(groupid: string, payload: object, ignore?: string|string[]) {
  const db = admin.firestore()
  const groupDoc = await db.collection('groups').doc(groupid).get()
  const group = groupDoc.data() as ServerGroup
  const viewers = group.viewers
  if (typeof ignore === 'string')
    ignore = [ignore]

  const tasks = viewers.map(async (uid) => {
    if (ignore && ignore.includes(uid))
      return []
    const tokenDoc = await db.collection('messaging_tokens').doc(uid).get()
    if (!tokenDoc.exists)
      return []
    const data = tokenDoc.data()
    if (!data || !data.tokens)
      return []
    const tokens = data.tokens as string[]
    return tokens.map(token => ({
      ...payload,
      token,
    }))
  })
  const messages = _.flatten(await Promise.all(tasks))
  if (!messages.length)
    return 0
  await admin.messaging().sendAll(messages)
  return messages.length
}
