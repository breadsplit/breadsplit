import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Eval, omitDeep } from './opschain'
import { Operation } from './types'
import { GroupCleanUp } from './cleanup'

export const db = admin.firestore()
export const GroupsRef = (id: string) => db.collection('groups').doc(id)
export const OperationsRef = (id: string) => db.collection('_operations').doc(id)
export const ExchangeRef = (id: string) => db.collection('exchanges').doc(id)

export const f = functions.https.onCall

export function recalculateGroupOperations (t: FirebaseFirestore.Transaction, groupid: string, ops: Operation[]) {
  const present = GroupCleanUp(omitDeep(Eval(ops)))

  t.update(OperationsRef(groupid), 'operations', omitDeep(ops))
  t.update(GroupsRef(groupid), {
    present,
    operations: ops.map(o => o.hash),
  })
}
