import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import _ from 'lodash'
import { ProcessOperations, EvalTransforms } from 'operation-sync'
import { ServerGroup, Group, Operation, ServerOperations, ServerBase } from '../../../types/models'
import { GenerateId } from '../../../core/randomstr'
import { Transforms } from '../../../core/transforms'

admin.initializeApp()

const db = admin.firestore()
const GroupsRef = db.collection('groups')
const BasesRef = db.collection('_bases')
const OperationsRef = db.collection('_operations')

const f = functions.https.onCall

export const publishGroup = f(async ({ group }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const user_uid = context.auth.uid
  const id = GenerateId.OnlineGroup()

  group.id = id
  group.online = true

  const serverGroup: ServerGroup = {
    id,
    present: group as Group,
    owner: user_uid,
    viewers: [user_uid],
    operations: [],
  }

  await GroupsRef
    .doc(id)
    .set(serverGroup)

  await BasesRef
    .doc(id)
    .set({
      base: group,
    })

  await OperationsRef
    .doc(id)
    .set({
      operations: [],
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

  const ids = _.union(group.viewers || [], context.auth.uid)

  await doc.ref.update('viewers', ids)
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

const transformCache = {}

export const uploadOperations = f(async ({ id, operations, lastsync }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const uid = context.auth.uid
  const server_timestamp = +new Date()
  const processed = ProcessOperations(operations).map((o): Operation => {
    return {
      ...o,
      uid,
      server_timestamp,
    }
  })

  // TODO: use db tranaction
  const base = ((await BasesRef.doc(id).get()).data() as ServerBase).base as Group
  const serverOps = (await OperationsRef.doc(id).get()).data() as ServerOperations
  const ops = _.sortBy(_.unionBy(serverOps.operations, processed, 'hash'), 'timestamp')

  const present = EvalTransforms(base, Transforms, ops, undefined, transformCache)

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
