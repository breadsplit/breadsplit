import * as admin from 'firebase-admin'
import { f } from './_helpers'

export const groupsCount = f(async (data, context) => {
  const groups = await admin.firestore().collection('groups').get()
  if (groups.empty)
    return 0
  return groups.size
})
