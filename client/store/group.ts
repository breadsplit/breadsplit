import Vue from 'vue'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { GroupDefault, MemberDefault, GroupStateDefault } from '~/utils/defaults'
import { GroupState, RootState, UserInfo } from '~/types/store'
import { merge } from 'lodash'
import { GenerateId } from '~/utils/randomstr'
import { MemberRoles } from '~/types/models'

export const state = GroupStateDefault

export const getters: GetterTree<GroupState, RootState> = {

  current(state) {
    if (!state.currentId)
      return undefined
    return state.groups[state.currentId] || undefined
  },

  groups(state) {
    return Object.values(state.groups)
  },

  memberById: state => ({ groupId, memberId }) => {
    groupId = groupId || state.currentId
    const group = state.groups[groupId]
    if (!group)
      return null
    return group.members[memberId]
  },
}

export const actions: ActionTree<GroupState, RootState> = {

  switchToOnline({ commit, dispatch }, { localId, onlineId, switchTo, memberLocalId }) {
    if (!onlineId)
      onlineId = GenerateId.OnlineGroup()
    commit('switchToOnline', { localId, onlineId, switchTo })
    dispatch('joinAsMember', { id: onlineId, memberLocalId })
  },

  joinAsMember({ commit, rootState, state }, { id, memberLocalId }) {
    if (!id)
      id = state.currentId
    const user = rootState.user.info
    commit('switchMemberToOnline', {
      id,
      memberLocalId,
      memberUID: user.uid,
      role: MemberRoles.owner,
    })
    commit('updateMemberInfo', {
      id,
      memberId: user.uid,
      memberInfo: user,
    })
  },
}

export const mutations: MutationTree<GroupState> = {

  switch(state, id: string | null) {
    state.currentId = id
  },

  // Groups
  add(state, payload) {
    const group = GroupDefault(payload)
    Vue.set(state.groups, group.id, group)
    state.currentId = group.id
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
    const m = MemberDefault(member)
    state.groups[id].members[m.id] = m
  },

  removeMember(state, { id, memberid }) {
    id = id || state.currentId
    Vue.delete(state.groups[id].members, memberid)
  },

  editMember(state, { id, memberid, changes }) {
    id = id || state.currentId
    const member = state.groups[id].members[memberid]
    if (member) {
      for (const key of Object.keys(changes))
        Vue.set(member, key, changes[key])
    }
  },

  // Transcations
  newTranscation(state, { id, trans }) {
    id = id || state.currentId
    state.groups[id].transactions.push(trans)
  },

  // Converters
  switchToOnline(state, { localId, onlineId, switchTo }) {
    const group = state.groups[localId]
    group.id = onlineId
    group.online = true
    state.groups[onlineId] = group
    Vue.delete(state.groups, localId)
    if (switchTo)
      state.currentId = onlineId
  },

  switchMemberToOnline(state, { id, memberLocalId, memberUID, role }) {
    const group = state.groups[id]
    const member = group.members[memberLocalId]
    member.id = memberUID
    if (role)
      member.role = role
    group.members[memberUID] = member

    function replacer(object, key) {
      if (object[key] === memberLocalId)
        object[key] = memberUID
    }

    for (const trans of group.transactions) {
      replacer(trans, 'creator')
      for (const c of trans.creditors)
        replacer(c, 'memberId')
      for (const d of trans.debtors)
        replacer(d, 'memberId')
    }
    Vue.delete(group.members, memberLocalId)
    if (!group.memberIds.includes(memberUID))
      group.memberIds.push(memberUID)
  },

  updateMemberInfo(state, { id, memberId, memberInfo }: { id: string; memberId: string; memberInfo: UserInfo}) {
    const group = state.groups[id]
    const member = group.members[memberId]
    member.avatarUrl = memberInfo.avatar_url || member.avatarUrl
    member.name = memberInfo.display_name || member.name
    member.email = memberInfo.email || member.email
  },

  // Firebase
  onServerUpdate(state, { id, data }) {
    // TODO: diff
    // Vue.set(state.groups, id, data)
  },
}
