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
const GroupsRef = db.collection('groups')
const OperationsRef = db.collection('_operations')

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

  await GroupsRef
    .doc(id)
    .set(serverGroup)

  await OperationsRef
    .doc(id)
    .set({
      operations: initOperations,
    })

  return { id }
})

export const joinGroup = f(async ({ id }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await GroupsRef
    .doc(id)
    .get()

  const group = doc.data()
  if (!group)
    throw new Error('group_not_exists')

  const viewers = _.union(group.viewers || [], [context.auth.uid])

  await GroupsRef
    .doc(id)
    .update('viewers', viewers)
})

export const removeGroup = f(async (id, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await GroupsRef
    .doc(id)
    .get()

  const group = doc.data() as ServerGroup
  if (!group)
    throw new Error('group_not_exists')

  // TODO: verify user permission

  // TODO: flag to remove, not actually deleted

  await GroupsRef
    .doc(id)
    .delete()

  return true
})

export const uploadOperations = f(async ({ id, operations, lastsync }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const uid = context.auth.uid
  const timestamp = +new Date()
  const processed = ProcessServerOperations(operations, uid, timestamp)

  // TODO: use db tranaction
  const serverOps = (await OperationsRef.doc(id).get()).data() as ServerOperations
  const ops = _.sortBy(_.unionBy(serverOps.operations, processed, 'hash'), 'timestamp')

  const present = Eval(ops)

  await OperationsRef
    .doc(id)
    .update('operations', ops)

  await GroupsRef
    .doc(id)
    .set({
      present,
      operations: ops.map(o => o.hash),
    }, {
      merge: true,
    })
})
