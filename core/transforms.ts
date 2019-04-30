import { TransformFunctions } from 'operation-sync'
import { Group, Member, Transaction } from '../types/models'

export const Transforms: TransformFunctions<Group> = {
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
    delete snap.members[id]
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
}
