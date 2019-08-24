import * as admin from 'firebase-admin'
import _ from 'lodash'
import { SERVER_HOST } from '../../../../meta/server_hosts'
import { ServerGroup, Operation, UserInfo } from './types'
import { getActivityDescription } from './core'
import { t } from './utils'
import { Eval } from './opschain'

const LOGO_URL = `${SERVER_HOST}/img/logo/favicon.png`

const GroupsRef = (id: string) => admin.firestore().collection('groups').doc(id)
const MessageTokensRef = (id: string) => admin.firestore().collection('messaging_tokens').doc(id)
const UserInfoRef = (id: string) => admin.firestore().collection('users').doc(id)

export async function GetUserInfos (uids: string[]) {
  const tasks = uids.map(async (uid) => {
    const doc = await UserInfoRef(uid).get()
    if (!doc.exists)
      return null
    const data = doc.data() as UserInfo
    return data
  })
  const users = await Promise.all(tasks)

  const info: {[s: string]: UserInfo} = {}

  for (const user of users) {
    if (user && user.uid)
      info[user.uid] = user
  }

  return info
}

const operation_names_to_notify = [
  'insert_transaction',
]

export async function PushGroupOperationsNotification (
  groupid: string,
  operations: Operation[],
  excludesIds: string[]
) {
  const groupDoc = await GroupsRef(groupid).get()
  const group = groupDoc.data() as ServerGroup
  const viewers = group.viewers
  const receivers = _.without(viewers, ...excludesIds)
  const users: Record<string, UserInfo> = {}

  const getUserInfo = async (uid: string) => {
    if (users[uid])
      return users[uid]
    const doc = await UserInfoRef(uid).get()
    if (!doc.exists)
      return undefined
    const user = doc.data() as UserInfo
    users[uid] = user
    return user
  }

  const messages: admin.messaging.Message[] = []

  for (const op of operations) {
    if (operation_names_to_notify.includes(op.name)) {
      const data = Eval([op])
      const act = data.activities[0]
      if (!act)
        continue
      const sender = await getUserInfo(act.by)

      for (const uid of receivers) {
        const { tokens } = (await MessageTokensRef(uid).get()).data() || { tokens: [] }
        const username = sender && sender.name
        const groupname = group.present.name
        const avatar = sender && sender.avatar_url

        for (const token of tokens) {
          const lang = token.locale
          const title = getActivityDescription(t, act, token.locale, username, true)
          const body = groupname // TODO: enrich info

          messages.push({
            notification: {
              title,
              body,
            },
            webpush: {
              notification: {
                title,
                body,
                icon: avatar || LOGO_URL,
                badge: LOGO_URL,
                timestamp: act.timestamp,
                lang,
              },
            },
            data: {
              type: op.name,
              group: group.id,
              uid: (sender && sender.uid) || undefined,
            } as Record<string, string>,
            token: token.token,
          })
        }
      }
    }
  }

  console.log(`SENDING NOTIFICATIONS ${JSON.stringify(messages)}`)
  if (!messages.length)
    return 0
  await admin.messaging().sendAll(messages)
  return messages.length
}
