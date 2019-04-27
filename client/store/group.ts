import Vue from 'vue'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { GroupDefault, MemberDefault, GroupStateDefault } from '~/utils/defaults'
import { GroupState, RootState } from '~/types/store'
import { merge } from 'lodash'

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

}

export const mutations: MutationTree<GroupState> = {

  switch(state, id: string | null) {
    state.currentId = id
  },

  // Groups
  add(state, payload) {
    const group = GroupDefault(payload)
    Vue.set(state.groups, group.id, group)
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
}
