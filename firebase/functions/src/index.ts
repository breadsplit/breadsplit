import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

export const joinGroup = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await admin.firestore()
    .collection('groups')
    .doc(data.groupid)
    .get()

  const group = doc.data()
  if (!group)
    throw new Error('group_not_exists')

  const ids = group.memberIds || []
  ids.push(context.auth.uid)

  await doc.ref.update('memberIds', ids)
})

export const alwaysTrue = functions.https.onCall(() => {
  return true
})

export const groupsCount = functions.https.onCall(async (data, context) => {
  const groups = await admin.firestore().collection('groups').get()
  if (groups.empty)
    return 0
  return groups.size
})
