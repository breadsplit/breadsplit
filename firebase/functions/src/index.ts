import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import _ from 'lodash'
// @ts-ignore
import JsCache from 'js-cache'
import { ProcessOperations, EvalTransforms, TransOperationOption } from 'opschain'
import { ServerGroup, Group, Operation, ServerOperations } from '../../../types/models'
import { GenerateId } from '../../../core/id_helper'
import { Transforms } from '../../../core/transforms'

admin.initializeApp()

const db = admin.firestore()
const GroupsRef = (id: string) => db.collection('groups').doc(id)
const OperationsRef = (id: string) => db.collection('_operations').doc(id)

const f = functions.https.onCall
const transformCache = new JsCache()
const transformCacheTTL = 10 * 24 * 60 * 60 * 1000 // 10 days

// warpper functions
function ProcessServerOperations(operations: TransOperationOption[], uid: string, server_timestamp?: number): Operation[] {
  return ProcessOperations(operations).map((o): Operation => {
    return {
      ...o,
      uid,
      server_timestamp: server_timestamp || +new Date(),
    }
  })
}

const _eval = EvalTransforms<Group>(Transforms, {
  cacheObject: transformCache,
  cacheTTL: transformCacheTTL,
  shouldCache: (operation) => {
    // skip caches that is too old
    return operation.timestamp + transformCacheTTL > +new Date()
  },
})

function Eval(operations: Operation[]): Group {
  /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
  return _eval({} as Group, operations)
  /* eslint-enable @typescript-eslint/no-object-literal-type-assertion */
}

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

  const initOperations = ProcessServerOperations([{
    name: 'init',
    data: group,
  }], context.auth.uid)

  const serverGroup: ServerGroup = {
    id,
    present: Eval(initOperations),
    owner: user_uid,
    viewers: [user_uid],
    operations: initOperations.map(i => i.hash),
  }

  const batch = db.batch()

  batch.set(GroupsRef(id), serverGroup)
  batch.set(OperationsRef(id), { operations: initOperations })

  await batch.commit()

  return { id }
})

export const joinGroup = f(async ({ id }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const uid = context.auth.uid

  await db.runTransaction(async (t) => {
    const doc = await t.get(GroupsRef(id))

    const group = doc.data()
    if (!group)
      throw new Error('group_not_exists')

    const viewers = _.union(group.viewers || [], [uid])

    t.update(GroupsRef(id), 'viewers', viewers)
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

  const uid = context.auth.uid
  const timestamp = +new Date()
  const processed = ProcessServerOperations(operations, uid, timestamp)

  await db.runTransaction(async (t) => {
    const doc = await t.get(OperationsRef(id))
    const serverOps = doc.data() as ServerOperations
    const ops = _
      .chain(serverOps.operations)
      .unionBy(processed, 'hash')
      .sortBy('timestamp')
      .value()

    const present = Eval(ops)

    t.update(OperationsRef(id), 'operations', ops)
    t.update(GroupsRef(id), {
      present,
      'operations': ops.map(o => o.hash),
    })
  })
})
