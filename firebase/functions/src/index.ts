import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import _ from 'lodash'
import { ProcessOperations, EvalTransforms } from 'operation-sync'
import { ServerGroup, Group, Operation } from '../../../types/models'
import { GenerateId } from '../../../core/randomstr'
import { Transforms } from '../../../core/transforms'

admin.initializeApp()

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
    base: group as Group,
    present: group as Group,
    owner: user_uid,
    viewers: [user_uid],
    operations: [],
  }

  await admin.firestore()
    .collection('groups')
    .doc(id)
    .set(serverGroup)

  return { id }
})

export const joinGroup = f(async ({ id }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await admin.firestore()
    .collection('groups')
    .doc(id)
    .get()

  const group = doc.data()
  if (!group)
    throw new Error('group_not_exists')

  const ids = group.viewers || []
  ids.push(context.auth.uid)

  await doc.ref.update('viewers', ids)
})

export const removeGroup = f(async (id, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await admin.firestore()
    .collection('groups')
    .doc(id)
    .get()

  const group = doc.data() as ServerGroup
  if (!group)
    throw new Error('group_not_exists')

  // TODO: verify user permission

  // TODO: flag to remove, not actually deleted

  await admin.firestore()
    .collection('groups')
    .doc(id)
    .delete()

  return true
})

const transformCache = {}

export const uploadOperations = f(async ({ id, operations, lastsync }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await admin.firestore()
    .collection('groups')
    .doc(id)
    .get()

  const group = doc.data() as ServerGroup

  const uid = context.auth.uid
  const server_timestamp = +new Date()
  const processed = ProcessOperations(operations).map((o): Operation => {
    return {
      ...o,
      uid,
      server_timestamp,
    }
  })
  const ServerOperations = _.sortBy(_.unionBy(group.operations, processed, 'hash'), 'timestamp')

  const present = EvalTransforms(group.base, Transforms, ServerOperations, undefined, transformCache)

  await admin.firestore()
    .collection('groups')
    .doc(id)
    .set({
      present,
      operations: ServerOperations,
    }, {
      merge: true,
    })
})
