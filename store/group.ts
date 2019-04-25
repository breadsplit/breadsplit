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
    return group.members.find(m => m.id === memberId)
  },
}

export const actions: ActionTree<GroupState, RootState> = {

}

export const mutations: MutationTree<GroupState> = {

  purge(state) {
    state.currentId = null
    Vue.set(state, 'groups', {})
  },

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
    state.groups[id].members.push(MemberDefault(member))
  },

  removeMember(state, { id, memberid }) {
    id = id || state.currentId
    const member = state.groups[id].members.find(m => m.id === memberid)
    const index = member ? state.groups[id].members.indexOf(member) : -1
    if (index > -1)
      state.groups[id].members.splice(index, 1)
  },

  editMember(state, { id, memberid, changes }) {
    id = id || state.currentId
    const member = state.groups[id].members.find(m => m.id === memberid)
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
