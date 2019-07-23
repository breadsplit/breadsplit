import * as admin from 'firebase-admin'
import _ from 'lodash'
import { ServerGroup, Operation, TokenRecord, UserInfo } from './types'
import { getActivityDescription } from './core'
import { t } from './utils'
import { Eval } from './opschain'

const GroupsRef = (id: string) => admin.firestore().collection('groups').doc(id)
const MessageTokensRef = (id: string) => admin.firestore().collection('messaging_tokens').doc(id)
const UserInfoRef = (id: string) => admin.firestore().collection('users').doc(id)

export async function GetMessagingTokens (uids: string[]) {
  const tasks = uids.map(async (uid) => {
    const tokenDoc = await MessageTokensRef(uid).get()
    if (!tokenDoc.exists)
      return []
    const data = tokenDoc.data()
    if (!data || !data.tokens)
      return []
    return (data.tokens as TokenRecord[]).map((t) => {
      t.uid = uid
      return t
    })
  })
  return _.flatten(await Promise.all(tasks)).filter(t => t.enabled)
}

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

export async function PushGroupOperationsNotification (
  groupid: string,
  operations: Operation[],
  excludesIds: string[]
) {
  const groupDoc = await GroupsRef(groupid).get()
  const group = groupDoc.data() as ServerGroup
  const viewers = group.viewers
  const receivers = _.without(viewers, ...excludesIds)
  const receiversTokens = await GetMessagingTokens(receivers)
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
    if (op.name === 'insert_transaction') {
      const data = Eval([op])
      const act = data.activities[0]
      if (!act)
        continue

      for (const token of receiversTokens) {
        const user = await getUserInfo(act.by)
        const username = user && user.name
        const description = getActivityDescription(t, act, token.locale, username, true)
        const groupname = group.present.name

        messages.push({
          notification: {
            title: description,
            body: groupname,
          },
          token: token.token,
        })
      }
    }
  }

  if (!messages.length)
    return 0
  await admin.messaging().sendAll(messages)
  return messages.length
}
