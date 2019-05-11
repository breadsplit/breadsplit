import * as admin from 'firebase-admin'
import _ from 'lodash'
import firebase from 'firebase'

export async function PushGroupNotification(receivers: string[], payload: object) {
  const tasks = receivers.map(async (uid) => {
    const tokenDoc = await firebase.firestore().collection('messaging_tokens').doc(uid).get()
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
