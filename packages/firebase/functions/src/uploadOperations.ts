import _ from 'lodash'
import { f, db, OperationsRef, recalculateGroupOperations } from './_helpers'
import { ProcessServerOperations } from './utils/opschain'
import { PushGroupOperationsNotification } from './utils/push_notifications'
import { ServerOperations } from './utils/types'

export const uploadOperations = f(async ({ id, operations, lastsync }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  // TODO: verify user permission

  const groupid = id as string
  const uid = context.auth.uid
  const timestamp = +new Date()
  const incomingOperations = ProcessServerOperations(operations, uid, timestamp)

  await db.runTransaction(async (t) => {
    const doc = await t.get(OperationsRef(id))
    const serverOps = doc.data() as ServerOperations
    const ops = _
      .chain((serverOps && serverOps.operations) || [])
      .unionBy(incomingOperations, 'hash')
      .sortBy('timestamp')
      .value()

    recalculateGroupOperations(t, groupid, ops)
  })

  PushGroupOperationsNotification(groupid, incomingOperations, [uid])
})
