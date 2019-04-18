import randomstr from '~/utils/randomstr'
import Vue from 'vue'

const CreateBook = () => ({
  id: randomstr(5),
  display: '',
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

const CreateMember = ({ display, email, phone, owner = false, type = 'user' }) => ({
  id: randomstr(5),
  display,
  email,
  owner,
  phone,
  type,
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
    const book = Object.assign({}, CreateBook(), payload)
    commit('addBook', book)
    dispatch('newMember', { bookidx: state.books.length - 1, user: rootState.user, owner: true })
  },
  newMember({ commit }, { bookidx, user, phone, type, owner = false }) {
    const { displayname, email } = user
    const member = CreateMember({ displayname, email, phone, owner, type })
    commit('addMember', { bookidx, member })
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
  removeMember(state, { bookidx, memberIndex }) {
    // TODO:
  },
  addBook(state, book) {
    state.books.push(book)
  },
  removeBook(state, bookidx) {
    state.books.splice(bookidx, 1)
  },
}
