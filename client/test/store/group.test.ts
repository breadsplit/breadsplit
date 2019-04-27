import { mutations, getters } from '~/store/group'
import { RootStateDefault, GroupStateDefault } from '~/utils/defaults'

describe('group state mutations', () => {
  it('add', () => {
    const state = GroupStateDefault()
    mutations.add(state, { name: 'Hello', id: 'group1' })
    expect(Object.keys(state.groups).length).toEqual(1)
    expect(state.groups).toHaveProperty('group1')
    expect(state.groups.group1.name).toEqual('Hello')
  })
})

describe('group state getters', () => {
  it('switchLocale', () => {
    const state = GroupStateDefault()
    const rootState = RootStateDefault({
      group: state,
    })
    expect(getters.current(state, null, rootState, null)).toBeUndefined()
  })
})
