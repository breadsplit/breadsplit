import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ServerGroup, Group } from '../../../types/models'
import { GenerateId } from '../../../core/randomstr'

admin.initializeApp()

const f = functions.https.onCall

export const joinGroup = f(async (data, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await admin.firestore()
    .collection('groups')
    .doc(data.groupid)
    .get()

  const group = doc.data()
  if (!group)
    throw new Error('group_not_exists')

  const ids = group.viewers || []
  ids.push(context.auth.uid)

  await doc.ref.update('viewers', ids)
})

export const alwaysTrue = f(() => {
  return true
})

export const groupsCount = f(async (data, context) => {
  const groups = await admin.firestore().collection('groups').get()
  if (groups.empty)
    return 0
  return groups.size
})

export const publishGroup = f(async ({ group }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const uid = context.auth.uid
  const groupid = GenerateId.OnlineGroup()

  group.id = groupid

  const serverGroup: ServerGroup = {
    id: groupid,
    base: group as Group,
    owner: uid,
    viewers: [uid],
    operations: [],
  }

  await admin.firestore()
    .collection('groups')
    .doc(groupid)
    .set(serverGroup)

  return groupid
})
