/*
This file is shared both in client and server.

If you made any modification,
Please DO DEPLOY firebase functions before merge into master.
*/
import cloneDeep from 'lodash/cloneDeep'
import { TransformFunctions, Group, Member, Transaction, ActivityAction, Entity, GroupMetaChanges } from '../types'

export type TransformKeys =
| 'init'
| 'modify_meta'
| 'insert_member'
| 'remove_member'
| 'modify_member'
| 'insert_transaction'
| 'change_member_id'
| 'new_activity'

export const Transforms: TransformFunctions<Group> = {
  init(snap, data, { by, timestamp } = {}) {
    snap = Object.assign(snap || {}, cloneDeep(data))
    if (!snap.activities)
      snap.activities = []
    snap.activities.push({
      by,
      timestamp,
      action: ActivityAction.publish,
      entity: Entity.group,
    })
    return snap
  },

  modify_meta(snap, changes?: GroupMetaChanges, { by, timestamp } = {}) {
    if (!changes)
      return snap
    changes = Object.assign({}, changes)
    if (changes.name) {
      snap.name = changes.name
      snap.activities.push({
        by,
        timestamp,
        action: ActivityAction.update,
        entity: Entity.group,
        update_fields: 'name',
        entity_name: changes.name,
      })
    }
    if (changes.options) {
      Object.assign(snap.options, changes.options)
      delete changes.options
    }
    Object.assign(snap, changes)
    return snap
  },

  insert_member(snap, member?: Member, { by, timestamp } = {}) {
    if (!member)
      return snap
    if (!member.uid)
      return snap
    snap.members[member.uid] = member
    snap.activities.push({
      by,
      timestamp,
      action: ActivityAction.insert,
      entity: Entity.member,
      entity_id: member.uid,
      entity_name: member.name,
    })
    return snap
  },

  remove_member(snap, uid?: string) {
    if (!uid)
      return snap
    if (!snap.members[uid])
      return snap
    snap.members[uid].removed = true
    return snap
  },

  modify_member(snap, data) {
    if (!data)
      return snap
    const { id, changes } = data
    if (!snap.members[id])
      return snap
    Object.assign(snap.members[id], changes)
    return snap
  },

  insert_transaction(snap, transaction?: Transaction, { by, timestamp } = {}) {
    if (!transaction)
      return snap
    snap.transactions.push(transaction)
    snap.activities.push({
      by,
      timestamp,
      action: ActivityAction.insert,
      entity: Entity.transaction,
      entity_id: transaction.id,
      entity_name: transaction.desc,
      entity_desc: `${transaction.currency} ${transaction.total_fee}`,
    })
    return snap
  },

  change_member_id(snap, data) {
    if (!data)
      return snap
    const { from, to } = data
    if (!from || !to)
      return snap

    const member = snap.members[from]
    if (!member || snap.members[to])
      return snap

    // change members field
    member.uid = to
    delete snap.members[from]
    snap.members[to] = member

    // utils function
    function replacer(object: any, field: string) {
      if (object[field] === from)
        object[field] = to
    }

    // change uids in transactions
    for (const trans of snap.transactions) {
      replacer(trans, 'creator')
      for (const c of trans.creditors)
        replacer(c, 'uid')
      for (const d of trans.debtors)
        replacer(d, 'uid')
    }

    return snap
  },

  new_activity(snap, data) {
    snap.activities.push(data)
    return snap
  },
}
