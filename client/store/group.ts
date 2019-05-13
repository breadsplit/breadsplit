import Vue from 'vue'
import merge from 'lodash/merge'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import union from 'lodash/union'
import { MutationTree, ActionTree, GetterTree, ActionContext } from 'vuex'
import { GroupState, RootState, ClientGroup, Group, ServerGroup, Operation } from '~/types'
import { EvalTransforms, ProcessOperation, BasicCache } from 'opschain'
import { Transforms, MemberDefault, ClientGroupDefault, TransactionDefault } from '~/core'
import { GroupStateDefault } from '~/store'

const OperationCache = new BasicCache<Group>()

export function Eval(group?: ClientGroup): Group | undefined {
  if (!group)
    return undefined
  const { base, operations } = group
  if (!base)
    return undefined
  return EvalTransforms<Group>(Transforms, { cacheObject: OperationCache })(base, operations)
}

function origin() {
  return window.location.origin
}

export const state = GroupStateDefault

export const getters: GetterTree<GroupState, RootState> = {

  current(state) {
    if (!state.currentId)
      return undefined
    return Eval(state.groups[state.currentId])
  },

  currentShareLink(state, getters) {
    const current = getters.current
    if (!current || !current.online)
      return undefined
    return `${origin()}/#/join?id=${current.id}`
  },

  all(state) {
    return orderBy(Object.values(state.groups), ['lastchanged'], ['desc'])
      .map(g => Eval(g))
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

  activeMembersOf: state => (id?: string) => {
    id = id || state.currentId || ''
    const group = Eval(state.groups[id])
    if (!group)
      return []
    return Object.values(group.members).filter(m => !m.removed)
  },

  activeMembers(state, getters) {
    return getters.activeMembersOf(state.currentId)
  },

  isSyncing: state => (id?: string) => {
    id = id || state.currentId || ''
    const group = state.groups[id]
    return !!(group.syncingOperations.length)
  },

  unsyncedOperationsOf: state => (id?: string) => {
    id = id || state.currentId || ''
    const group = state.groups[id]
    const isUnsynced = (o: Operation) => !(group.syncingOperations || []).includes(o.hash)
    return group.operations.filter(isUnsynced)
  },
}

function NewOperation(
  context: ActionContext<GroupState, RootState>,
  groupid: string,
  name: string,
  data: any,
  meta: object = {}
) {
  meta = {
    ...meta,
    by: context.rootGetters['user/uid'],
    timestamp: +new Date(),
  }
  context.commit('newOperation', { id: groupid, name, data, meta })
}

export const actions: ActionTree<GroupState, RootState> = {
  addMember(context, { id, member }) {
    member = MemberDefault(member)
    NewOperation(context, id, 'insert_member', member)
  },

  removeMember(context, { id, memberid }) {
    NewOperation(context, id, 'remove_member', memberid)
  },

  editMember(context, { id, memberid, changes }) {
    NewOperation(context, id, 'modify_member', { id: memberid, changes })
  },

  // Transcations
  newTranscation(context, { id, trans }) {
    trans = TransactionDefault(trans)
    NewOperation(context, id, 'insert_transaction', trans)
  },

  editTranscation(context, { id, transid, changes }) {
    NewOperation(context, id, 'modify_transaction', { id: transid, changes })
  },

  changeMemberId(context, { id, from, to }) {
    NewOperation(context, id, 'change_member_id', { from, to })
  },
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

  newOperation(state, { id, name, data, meta }) {
    id = id || state.currentId
    const group = state.groups[id]
    if (group) {
      group.operations.push(ProcessOperation({ name, data, meta }))
      group.lastchanged = +new Date()
    }
  },

  // Members

  // Firebase
  onServerUpdate(state, { data, timestamp }) {
    if (!data || !data.id)
      return
    const group: ServerGroup = data
    if (!state.groups[group.id]) {
      Vue.set(state.groups, group.id, {
        id: group.id,
        online: true,
        operations: [],
        lastchanged: timestamp,
      })
    }

    const serverOperations = group.operations
    const localOperations = state.groups[group.id].operations || []
    const unsyncedOperations = localOperations.filter(
      o => !includes(serverOperations, o.hash)
    )

    const clientGroup = state.groups[group.id]

    clientGroup.syncingOperations = (clientGroup.syncingOperations || [])
      .filter(i => !serverOperations.includes(i))
    clientGroup.base = group.present
    clientGroup.operations = unsyncedOperations
    clientGroup.lastsync = timestamp
  },

  syncOperations(state, { id, operations }) {
    const group = state.groups[id]
    group.syncingOperations = union(group.syncingOperations || [], operations.map(o => o.hash))
  },

  resetSyncingStates(state) {
    Object.values(state.groups).forEach((group) => {
      group.syncingOperations = []
    })
  },
}
