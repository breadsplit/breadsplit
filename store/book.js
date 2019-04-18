import randomstr from '~/utils/randomstr'
import Vue from 'vue'

const CreateBook = () => ({
  id: randomstr(5),
  name: '',
  icon: '',
  color: '',
  members: [],
  records: [],
  currenies: [],
  currenyrecords: [],
  options: {},
  serverid: null,
  lastsync: null,
  online: false,
  operation_history: [],
})

const CreateMember = ({ name, email, phone, role, avatar }) => ({
  id: randomstr(5),
  name,
  email,
  phone,
  avatar,
  role,
  uid: null,
})

export const state = () => ({
  books: [],
  currentIndex: -1,
})

export const getters = {
  current(state) {
    if (state.currentIndex < 0)
      return null
    return state.books[state.currentIndex] || null
  },
}

export const actions = {
  new({ commit, rootState, state, dispatch }, payload) {
    console.log('PAYLOAD', payload)
    const book = Object.assign({}, CreateBook(), payload)
    commit('addBook', book)
    dispatch('newMember', {
      bookidx: state.books.length - 1,
      member: { ...rootState.user, role: 'owner' },
    })
  },
  newMember({ commit, state }, { bookidx, member }) {
    if (bookidx == null || bookidx < 0)
      bookidx = state.currentIndex
    if (bookidx >= 0)
      commit('addMember', { bookidx, member: CreateMember(member) })
  },
  editMember({ commit, state }, { bookidx, memberid, changes }) {
    if (bookidx == null || bookidx < 0)
      bookidx = state.currentIndex
    if (bookidx >= 0)
      commit('editMember', { bookidx, memberid, changes })
  },
  removeMember({ commit, state }, { bookidx, memberid }) {
    if (bookidx == null || bookidx < 0)
      bookidx = state.currentIndex
    if (bookidx >= 0)
      commit('removeMember', { bookidx, memberid })
  },
}

export const mutations = {
  purge(state) {
    state.currentIndex = -1
    Vue.set(state, 'books', [])
  },
  switchTo(state, index) {
    state.currentIndex = index
  },
  switchToId(state, id) {
    const book = state.books.find(b => b.id === id)
    state.currentIndex = state.books.indexOf(book)
  },
  addMember(state, { bookidx, member }) {
    // TODO:Vaildate the uniquity of members' email
    state.books[bookidx].members.push(member)
  },
  removeMember(state, { bookidx, memberid }) {
    const member = state.books[bookidx].members.find(m => m.id === memberid)
    const index = state.books[bookidx].members.indexOf(member)
    if (index > -1)
      state.books[bookidx].members.splice(index, 1)
  },
  editMember(state, { bookidx, memberid, changes }) {
    const member = state.books[bookidx].members.find(m => m.id === memberid)
    Object.assign(member, changes)
  },
  addBook(state, book) {
    state.books.push(book)
  },
  removeBook(state, bookidx) {
    state.books.splice(bookidx, 1)
  },
}
