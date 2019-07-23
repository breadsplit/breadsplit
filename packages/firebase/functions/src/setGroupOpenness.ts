import { f, GroupsRef } from './_helpers'

export const setGroupOpenness = f(async ({ id, value }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await GroupsRef(id).get()

  if (!doc.exists)
    throw new Error('group_not_exists')

  await GroupsRef(id).update('public', value)

  return value
})
