import { f, GroupsRef, OperationsRef } from './utils/helpers'
import { ServerGroup } from './utils/types'

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
