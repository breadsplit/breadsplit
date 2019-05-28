import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import _ from 'lodash'
import dayjs from 'dayjs'

import { TransOperationOption, ServerGroup, ServerOperations, Entity, Group, Operation } from '../../../types'
import { GenerateId, IsThisId, MemberDefault } from '../../../core'
import { formatDate, queryExchangeRates } from './exchanges'
import { ProcessServerOperations, Eval, omitDeep } from './opschain'
import { PushGroupOperationsNotification } from './push_notifications'

admin.initializeApp()

const db = admin.firestore()
const GroupsRef = (id: string) => db.collection('groups').doc(id)
const OperationsRef = (id: string) => db.collection('_operations').doc(id)
const ExchangeRef = (id: string) => db.collection('exchanges').doc(id)

const f = functions.https.onCall

function recalculateGroupOperations(t: FirebaseFirestore.Transaction, groupid: string, ops: Operation[]) {
  const present = Eval(ops)

  t.update(OperationsRef(groupid), 'operations', omitDeep(ops))
  t.update(GroupsRef(groupid), omitDeep({
    present,
    'operations': ops.map(o => o.hash),
  }))
}

// firebase functions
export const groupsCount = f(async (data, context) => {
  const groups = await admin.firestore().collection('groups').get()
  if (groups.empty)
    return 0
  return groups.size
})

export const publishGroup = f(async ({ group }: { group: Group }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const user_uid = context.auth.uid
  const id = GenerateId.OnlineGroup()

  group.id = id
  group.online = true
  group.activities = (group.activities || [])
    .map((act) => {
      if (!act.by || act.by === 'me')
        act.by = user_uid
      return act
    })

  const initOperations = ProcessServerOperations([{
    name: 'init',
    data: group,
    meta: {
      by: user_uid,
      timestamp: +new Date(),
    },
  }, {
    name: 'change_member_id',
    data: {
      from: 'me',
      to: user_uid,
    },
  }], user_uid)

  const serverGroup: ServerGroup = {
    id,
    present: Eval(initOperations),
    owner: user_uid,
    viewers: [user_uid],
    operations: initOperations.map(i => i.hash),
    open: true,
  }

  const batch = db.batch()

  batch.set(GroupsRef(id), omitDeep(serverGroup))
  batch.set(OperationsRef(id), omitDeep({ operations: initOperations }))

  await batch.commit()

  return { id }
})

export const joinGroup = f(async ({ id, join_as }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const uid = context.auth.uid

  await db.runTransaction(async (t) => {
    const group = (await t.get(GroupsRef(id))).data() as ServerGroup
    const ops = (await t.get(OperationsRef(id))).data() as ServerOperations

    if (!group || !ops)
      throw new Error('group_not_exists')

    // skip if user already inside the group
    if (group.viewers.includes(uid))
      return

    group.viewers.push(uid)

    const newoperations: TransOperationOption[] = [{
      name: 'new_activity',
      data: {
        by: uid,
        timestamp: +new Date(),
        entity: Entity.viewer,
        action: 'insert',
      },
    }]

    const memberOfGroup = Object.keys(group.present.members).includes(uid)

    // if user is not a member of group
    if (!memberOfGroup) {
      // if a local member is specified, convert it to the user
      if (join_as && IsThisId.LocalMember(join_as)) {
        newoperations.push({
          name: 'change_member_id',
          data: {
            from: join_as.toString(),
            to: uid,
          },
        })
      }
      // otherwise join as a new member
      else {
        newoperations.push({
          name: 'insert_member',
          data: MemberDefault({ uid }),
        })
      }
    }

    ProcessServerOperations(newoperations, uid)
      .forEach((op) => {
        ops.operations.push(op)
      })

    t.update(GroupsRef(id), 'viewers', group.viewers)

    recalculateGroupOperations(t, id, ops.operations)
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
      .chain((serverOps && serverOps.operations) || [])
      .unionBy(incomingOperations, 'hash')
      .sortBy('timestamp')
      .value()

    recalculateGroupOperations(t, groupid, ops)
  })

  await PushGroupOperationsNotification(groupid, incomingOperations, [uid])
})

export const getExchangeRate = f(async ({ date } = {}, context) => {
  const d = dayjs(date)
  if (d.isBefore('2019-01-01'))
    return undefined
  if (d.isAfter(dayjs(), 'day'))
    return undefined

  date = formatDate(d)
  const doc = await ExchangeRef(date).get()
  if (doc.exists)
    return doc.data()

  const data = await queryExchangeRates(date)
  if (data)
    await ExchangeRef(date).set(data)
  return data
})
