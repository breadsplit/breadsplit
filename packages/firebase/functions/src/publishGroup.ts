import { f, db, GroupsRef, OperationsRef } from './_helpers'
import { ProcessServerOperations, Eval, omitDeep } from './utils/opschain'
import { Group, ServerGroup } from './utils/types'
import { GenerateId, SharedGroupOptionsDefault } from './utils/core'

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
    options: SharedGroupOptionsDefault(),
  }

  const batch = db.batch()

  batch.set(GroupsRef(id), omitDeep(serverGroup))
  batch.set(OperationsRef(id), omitDeep({ operations: initOperations }))

  await batch.commit()

  return { id }
})
