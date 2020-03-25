import _ from 'lodash'
import { f, GroupsRef, db, OperationsRef, recalculateGroupOperations } from './utils/helpers'
import { ServerOperations } from './utils/types'

export const fixGroup = f(async({ id }: { id: string }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await GroupsRef(id).get()

  if (!doc.exists)
    throw new Error('group_not_exists')

  await db.runTransaction(async(t) => {
    const doc = await t.get(OperationsRef(id))
    const serverOps = doc.data() as ServerOperations

    serverOps.operations.forEach((i) => {
      if (i.name === 'init')
        i.timestamp = 0
    })

    const ops = _
      .chain((serverOps && serverOps.operations) || [])
      .sortBy('timestamp')
      .value()

    recalculateGroupOperations(t, id, ops)
  })
})
