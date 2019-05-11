import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import _ from 'lodash'

import { ServerGroup, ServerOperations, Entity, ActivityAction } from '../../../types/models'
import { GenerateId } from '../../../core/id_helper'
import { ProcessServerOperations, Eval, omitDeep } from './opschain'
import { PushGroupNotification } from './push_notifications'
import { buildNotificationFromActivities } from './activities'

admin.initializeApp()

const db = admin.firestore()
const GroupsRef = (id: string) => db.collection('groups').doc(id)
const OperationsRef = (id: string) => db.collection('_operations').doc(id)

const f = functions.https.onCall

// firebase functions
export const groupsCount = f(async (data, context) => {
  const groups = await admin.firestore().collection('groups').get()
  if (groups.empty)
    return 0
  return groups.size
})

export const publishGroup = f(async ({ group }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const user_uid = context.auth.uid
  const id = GenerateId.OnlineGroup()

  group.id = id
  group.online = true
  group.activities = []

  const initOperations = ProcessServerOperations([{
    name: 'init',
    data: group,
    meta: {
      by: user_uid,
      timestamp: +new Date(),
    },
  }], user_uid)

  const serverGroup: ServerGroup = {
    id,
    present: Eval(initOperations),
    owner: user_uid,
    viewers: [user_uid],
    operations: initOperations.map(i => i.hash),
  }

  const batch = db.batch()

  batch.set(GroupsRef(id), omitDeep(serverGroup))
  batch.set(OperationsRef(id), omitDeep({ operations: initOperations }))

  await batch.commit()

  return { id }
})

export const joinGroup = f(async ({ id }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const uid = context.auth.uid

  const join_operation = ProcessServerOperations([{
    name: 'new_activity',
    data: {
      by: uid,
      timestamp: +new Date(),
      entity: Entity.viewer,
      action: ActivityAction.insert,
    },
  }], uid)[0]

  await db.runTransaction(async (t) => {
    const group = (await t.get(GroupsRef(id))).data() as ServerGroup
    const ops = (await t.get(OperationsRef(id))).data() as ServerOperations

    if (!group || !ops)
      throw new Error('group_not_exists')

    const viewers = _.union(group.viewers || [], [uid])
    const operations = ops.operations

    operations.push(join_operation)

    t.update(GroupsRef(id), 'viewers', viewers)
    t.update(OperationsRef(id), 'operations', omitDeep(operations))
  })
})

export const removeGroup = f(async (id, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await GroupsRef(id).get()

  const group = doc.data() as ServerGroup
  if (!group)
    throw new Error('group_not_exists')

  // TODO: verify user permission

  // TODO: flag to remove, not actually deleted

  await GroupsRef(id).delete()

  await OperationsRef(id).delete()

  return true
})

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
      .chain(serverOps.operations)
      .unionBy(incomingOperations, 'hash')
      .sortBy('timestamp')
      .value()

    const present = Eval(ops)

    t.update(OperationsRef(groupid), 'operations', omitDeep(ops))
    t.update(GroupsRef(groupid), omitDeep({
      present,
      'operations': ops.map(o => o.hash),
    }))
  })

  for (const op of incomingOperations) {
    if (op.name === 'insert_transaction') {
      const data = Eval([op])
      const act = data.activities[0]
      if (!act)
        continue

      const notification = buildNotificationFromActivities(act, 'zh-tw', '不知道') // TODO:

      const groupDoc = await GroupsRef(groupid).get()
      const group = groupDoc.data() as ServerGroup
      const viewers = group.viewers
      const receivers = _.without(viewers, uid)

      await PushGroupNotification(receivers, {
        notification,
      })
    }
  }
})

export const groupMeta = f(async ({ id }, context) => {
  if (!id)
    return undefined
  const doc = await GroupsRef(id).get()
  if (!doc.exists)
    return undefined
  const serverGroup = doc.data() as ServerGroup
  const group = serverGroup.present

  return {
    name: group.name,
    icon: group.icon,
    color: group.color,
    viewers: serverGroup.viewers,
  }
})
