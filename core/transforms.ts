import { TransformFunctions } from 'operation-sync'
import { Group, Member, Transaction } from '../types/models'

export const Transforms: TransformFunctions<Group> = {
  init(snap, data) {
    return Object.assign(snap || {}, data)
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

  insert_transaction(snap, data) {
    if (!data)
      return snap
    const transaction = data as Transaction
    snap.transactions.push(transaction)
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
}
