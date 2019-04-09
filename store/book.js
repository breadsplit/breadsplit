import randomstr from '~/utils/randomstr'

export const MakeBook = () => ({
  id: randomstr(5),
  display: '',
  icon: '',
  color: '',
  members: [],
  bills: [],
  currenies: [],
  currenyrecords: [],
  options: {

  },
  serverid: null,
  lastsync: null,
  offline: true,
})

export const state = () => ({
  books: [],
  currentIndex: 0,
})

export const getters = {
  current(state) {
    if (state.currentIndex == null)
      return null
    return state.books[state.currentIndex] || null
  },
}

export const actions = {
  newBook({ commit, rootState, dispatch }, inputed) {
    const book = Object.assign({}, MakeBook(), inputed)
    commit('addBook', book)
    dispatch('newMember', { bookindex: state.books.length - 1, user: rootState.user, owner: true })
  },
  newMember({ commit }, { bookindex, user, type = 'user', owner = false }) {
    const { displayname, email } = user
    const member = { displayname, email, owner, type }
    commit('addMember', { index: bookindex, member })
  },
}

export const mutations = {
  switchTo(state, index) {
    state.currentIndex = index
  },
  switchToId(state, id) {
    const book = state.books.find(b => b.id === id)
    state.currentIndex = state.books.indexOf(book) || null
  },
  addMember(state, { index, member }) {
    // TODO:Vaildate the uniquity of memebers' email
    state.books[index].members.push(member)
  },
  removeMember(state, { index, memberIndex }) {
    // TODO:
  },
  addBook(state, book) {
    state.books.push(book)
  },
  removeBook(state, bookIndex) {
    state.books.splice(bookIndex, 1)
  },
}
