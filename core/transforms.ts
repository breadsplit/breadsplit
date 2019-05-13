/*
This file is shared both in client and server.

If you made any modification,
Please DO DEPLOY firebase functions before merge into master.
*/
import { TransformFunctions } from 'opschain'
import { Group, Member, Transaction, ActivityAction, Entity } from '../types'

export const Transforms: TransformFunctions<Group> = {
  init(snap, data, { by, timestamp } = {}) {
    snap = Object.assign(snap || {}, data)
    snap.activities = [{
      by,
      timestamp,
      action: ActivityAction.insert,
      entity: Entity.group,
    }]
    return snap
  },

  rename(snap, name) {
    snap.name = (name || '').toString()
    return snap
  },

  insert_member(snap, data) {
    if (!data)
      return snap
    const member = data as Member
    snap.members[member.id] = member
    return snap
  },

  remove_member(snap, data) {
    if (!data)
      return snap
    const id = data as string
    if (!snap.members[id])
      return snap
    snap.members[id].removed = true
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

  insert_transaction(snap, data, { by, timestamp } = {}) {
    if (!data)
      return snap
    const transaction = data as Transaction
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
    member.id = to
    delete snap.members[from]
    snap.members[to] = member

    // utils function
    function replacer(object: any, field: string) {
      if (object[field] === from)
        object[field] = to
    }

    // change memberIds in transactions
    for (const trans of snap.transactions) {
      replacer(trans, 'creator')
      for (const c of trans.creditors)
        replacer(c, 'memberId')
      for (const d of trans.debtors)
        replacer(d, 'memberId')
    }

    return snap
  },

  new_activity(snap, data) {
    snap.activities.push(data)
    return snap
  },
}
