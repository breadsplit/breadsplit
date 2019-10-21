import { oc } from 'ts-optchain'
import { SharedGroupOptions } from '../../../types'
import { f, GroupsRef } from './utils/helpers'

export const changeGroupOptions = f(async ({ id, changes }: {id: string; changes: Partial<SharedGroupOptions> }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const doc = await GroupsRef(id).get()

  if (!doc.exists)
    throw new Error('group_not_exists')

  const originalOptions = oc(doc.data()).options({})

  await GroupsRef(id).update('options', Object.assign({}, originalOptions, changes))
})
