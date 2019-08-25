import * as admin from 'firebase-admin'
import _ from 'lodash'
import { oc } from 'ts-optchain'
import { SERVER_HOST } from '../../../../meta/server_hosts'
import { ServerGroup, Operation, UserInfo, Transaction, Group } from './types'
import { ParseCategory, TransactionHelper } from './core'
import { t, numberToMoney } from './utils'
import { Eval } from './opschain'

const LOGO_URL = `${SERVER_HOST}/img/logo/favicon.png`

const GroupsRef = (id: string) => admin.firestore().collection('groups').doc(id)
const MessageTokensRef = (id: string) => admin.firestore().collection('messaging_tokens').doc(id)
const UserInfoRef = (id: string) => admin.firestore().collection('users').doc(id)

async function GetUserInfo (uid: string) {
  const doc = await UserInfoRef(uid).get()
  if (!doc.exists)
    return null
  const data = doc.data() as UserInfo
  return data
}

export async function GetUserInfos (uids: string[]) {
  const users = await Promise.all(uids.map(GetUserInfo))

  const info: {[s: string]: UserInfo} = {}

  for (const user of users) {
    if (user && user.uid)
      info[user.uid] = user
  }

  return info
}

function GetTransactionDesc (trans: Transaction, group: Group, locale: string) {
  if (trans.desc)
    return trans.desc
  const category = ParseCategory(trans.category, group, t, locale)
  return category.text
}

async function GetUserName (uid: string, group: Group) {
  return oc(group).members[uid].name('') || oc(await GetUserInfo(uid)).name('')
}

async function ParseTransaction (trans: Transaction, group: Group, locale: string, targetUid: string, creator?: string) {
  const currency = trans.currency
  if (trans.type === 'expenses') {
    const balance = TransactionHelper.from(trans).balanceChangesOf(targetUid)
    if (!balance)
      return

    const balanceChange = +balance.balance
    return {
      type: 'expense',
      fee: numberToMoney(+balance.debt, locale, currency),
      lent: balanceChange > 0 ? numberToMoney(balanceChange, locale, currency) : undefined,
      owed: balanceChange > 0 ? undefined : numberToMoney(-balanceChange, locale, currency),
      desc: GetTransactionDesc(trans, group, locale),
      creator,
    }
  }
  else if (trans.type === 'transfer') {
    return {
      type: 'transfer',
      fee: numberToMoney(+trans.total_fee, locale, currency),
      from: await GetUserName(trans.debtors[0].uid, group),
      to: await GetUserName(trans.creditors[0].uid, group),
      desc: GetTransactionDesc(trans, group, locale),
      creator,
    }
  }
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
      const transaction = data.transactions[0]
      if (!transaction || !op.meta || !op.meta.by)
        continue
      const sender = await getUserInfo(op.meta.by)

      for (const uid of receivers) {
        const { tokens } = (await MessageTokensRef(uid).get()).data() || { tokens: [] }
        const avatar = sender && sender.avatar_url

        for (const token of tokens) {
          const lang = token.locale
          const data = await ParseTransaction(transaction, group.present, lang, uid, sender && sender.name)
          const $t = (key: string, args?: any) => t(key, lang, args).toString()

          if (!data)
            continue

          let title = ''
          let body = ''
          if (data.type === 'expense') {
            title = $t('notifications.new_expense_title', data)
            body = $t('notifications.new_expense_source', data)
            if (data.lent)
              body += $t('notifications.new_expense_lent', data)
            else if (data.owed)
              body += $t('notifications.new_expense_owed', data)
          }
          else if (data.type === 'transfer') {
            if (data.to === uid)
              title = $t('notifications.new_transfer_received', data)
            else if (data.from === uid)
              title = $t('notifications.new_transfer_sent', data)
            body = $t('notifications.new_transfer_source', data)
          }

          if (!title)
            continue

          const link = `${SERVER_HOST}/group/${group.id}?transid=${transaction.id}`

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
                timestamp: oc(op).meta.timestamp(+new Date()),
                lang,
                image: oc(transaction).attached_images[0]('') || undefined,
              },
              fcmOptions: {
                link,
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
