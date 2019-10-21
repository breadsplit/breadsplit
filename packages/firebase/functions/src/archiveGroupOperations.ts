import { f, GroupsRef, db, OperationsRef, recalculateGroupOperations } from './utils/helpers'
import { ProcessServerOperations, omitDeep } from './utils/opschain'

export const archiveGroupOperations = f(async ({ id }: {id: string }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await GroupsRef(id).get()

  if (!doc.exists)
    throw new Error('group_not_exists')

  const user_uid = context.auth.uid

  await db.runTransaction(async (t) => {
    const group = await t.get(GroupsRef(id))
    const data = group.data()
    if (data) {
      const ops = ProcessServerOperations([{
        name: 'init',
        data: data.present,
      }], user_uid)
      t.update(OperationsRef(id), 'operations', omitDeep(ops))

      recalculateGroupOperations(t, id, ops)
    }
  })
})
