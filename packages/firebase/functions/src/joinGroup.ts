import { oc } from 'ts-optchain'
import { f, db, GroupsRef, OperationsRef, recalculateGroupOperations } from './_helpers'
import { ServerGroup, ServerOperations, TransOperationOption } from './utils/types'
import { IsThisId, MemberDefault } from './utils/core'
import { ProcessServerOperations } from './utils/opschain'

export const joinGroup = f(async ({ id, join_as }, context) => {
  if (!context.auth || !context.auth.uid)
    throw new Error('auth_required')

  const uid = context.auth.uid

  await db.runTransaction(async (t) => {
    const group = (await t.get(GroupsRef(id))).data() as ServerGroup
    const ops = (await t.get(OperationsRef(id))).data() as ServerOperations

    if (!group || !ops || !oc(group).options.public(false))
      throw new Error('group_not_exists')

    // skip if user already inside the group
    if (group.viewers.includes(uid))
      return

    group.viewers.push(uid)

    const newoperations: TransOperationOption[] = [{
      name: 'new_activity',
      data: {
        by: uid,
        timestamp: +new Date(),
        entity: 'viewer',
        action: 'insert',
      },
    }]

    const memberOfGroup = Object.keys(group.present.members).includes(uid)

    // if user is not a member of group
    if (!memberOfGroup) {
      // if a local member is specified, convert it to the user
      if (join_as && IsThisId.LocalMember(join_as)) {
        newoperations.push({
          name: 'change_member_id',
          data: {
            from: join_as.toString(),
            to: uid,
          },
        })
      }
      // otherwise join as a new member
      else {
        newoperations.push({
          name: 'insert_member',
          data: MemberDefault({ uid }),
        })
      }
    }

    ProcessServerOperations(newoperations, uid)
      .forEach((op) => {
        ops.operations.push(op)
      })

    t.update(GroupsRef(id), 'viewers', group.viewers)

    recalculateGroupOperations(t, id, ops.operations)
  })
})
