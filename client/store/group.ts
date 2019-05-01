import Vue from 'vue'
import merge from 'lodash/merge'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { MemberDefault, GroupStateDefault, ClientGroupDefault, TransactionDefault } from '~/utils/defaults'
import { GroupState, RootState } from '~/types/store'
import { GenerateId } from '~/../core/randomstr'
import { MemberRoles, ClientGroup, Group } from '~/types/models'
import { EvalTransforms, ProcessOperation } from 'operation-sync'
import { Transforms } from '../../core'
import { ServerGroup, UserInfo } from '../../types/models'

const OperationCache = {}

export function Eval(group?: ClientGroup): Group | undefined {
  if (!group)
    return undefined
  const { base, operations } = group
  if (!base)
    return undefined
  return EvalTransforms<Group>(base, Transforms, operations, undefined, OperationCache)
}

function NewOperation(group: ClientGroup, name: string, data) {
  group.operations.push(ProcessOperation({ name, data }))
}

export const state = GroupStateDefault

export const getters: GetterTree<GroupState, RootState> = {

  current(state) {
    if (!state.currentId)
      return undefined
    return Eval(state.groups[state.currentId])
  },

  all(state) {
    return Object.values(state.groups).map(g => Eval(g))
  },

  id: state => (id) => {
    return Eval(state.groups[id])
  },

  memberById: state => ({ groupId, memberId }) => {
    groupId = groupId || state.currentId
    const group = Eval(state.groups[groupId])
    if (!group)
      return null
    return group.members[memberId]
  },
}

export const actions: ActionTree<GroupState, RootState> = {

}

export const mutations: MutationTree<GroupState> = {

  switch(state, id: string | null) {
    state.currentId = id
  },

  // Groups
  add(state, payload) {
    const group = ClientGroupDefault(payload)
    Vue.set(state.groups, group.base.id, group)
    state.currentId = group.base.id
  },

  remove(state, id) {
    id = id || state.currentId
    state.currentId = null
    Vue.delete(state.groups, id)
  },

  edit(state, { id, changes }) {
    id = id || state.currentId
    merge(state.groups[id], changes)
  },

  removeOnlineGroups(state) {
    for (const id of Object.keys(state.groups)) {
      if (state.groups[id].online)
        Vue.delete(state.groups, id)
    }
  },

  // Members
  addMember(state, { id, member }) {
    id = id || state.currentId
    member = MemberDefault(member)
    NewOperation(state.groups[id], 'insert_member', member)
  },

  removeMember(state, { id, memberid }) {
    id = id || state.currentId
    NewOperation(state.groups[id], 'remove_member', memberid)
  },

  editMember(state, { id, memberid, changes }) {
    id = id || state.currentId
    NewOperation(state.groups[id], 'modify_member', { id: memberid, changes })
  },

  // Transcations
  newTranscation(state, { id, trans }) {
    id = id || state.currentId
    trans = TransactionDefault(trans)
    NewOperation(state.groups[id], 'insert_transaction', trans)
  },

  editTranscation(state, { id, transid, changes }) {
    id = id || state.currentId
    NewOperation(state.groups[id], 'modify_transaction', { id: transid, changes })
  },

  updateMemberInfo(state, { id, memberId, memberInfo }: { id: string; memberId: string; memberInfo: UserInfo}) {
    /* const group = state.groups[id]
    const member = group.members[memberId]
    member.avatarUrl = memberInfo.avatar_url || member.avatarUrl
    member.name = memberInfo.display_name || member.name
    member.email = memberInfo.email || member.email */
  },

  // Firebase
  onServerUpdate(state, { data, timestamp }) {
    if (!data || !data.id)
      return
    const group: ServerGroup = data
    if (!state.groups[group.id]) {
      Vue.set(state.groups, group.id, {
        id: group.id,
        base: group.present,
        operations: [],
        online: true,
      })
    }
    state.groups[group.id].base = group.present
    state.groups[group.id].operations = []
    state.groups[group.id].lastsync = timestamp
  },
}
