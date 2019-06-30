import { getters } from '../../../packages/client/store/group'
import { RootStateDefault, GroupStateDefault } from '../../../packages/client/store'

describe('group state getters', () => {
  it('current', () => {
    const state = GroupStateDefault()
    const rootState = RootStateDefault({
      group: state,
    })
    expect(getters.current(state, null, rootState, null)).toBeUndefined()
  })
})

/* describe('group state mutations', () => {
  let state: GroupState
  let groupsAmount = 0

  beforeEach(() => {
    state = GroupStateDefault()
    actions.add(state, {
      name: 'group1',
      id: 'group1',
    })
    groupsAmount = 1
  })

  it('setup test', () => {
    expect(Object.keys(state.groups).length).toEqual(groupsAmount)
    expect(state.groups).toHaveProperty('group1')
    expect(state.groups.group1.id).toEqual('group1')
  })

  it('add edit remove', () => {
    // Add
    mutations.add(state, {
      name: 'test',
      id: 'test',
    })
    expect(Object.keys(state.groups).length).toEqual(groupsAmount + 1)
    expect(state.groups).toHaveProperty('test')
    expect(state.groups.test.id).toEqual('test')
    expect(state.groups.test.base.id).toEqual('test')
    expect(state.groups.test.base.icon).toBeFalsy()

    // Remove
    mutations.remove(state, 'test')
    expect(Object.keys(state.groups).length).toEqual(groupsAmount)
    expect(state.groups).not.toHaveProperty('test')
  })
}) */
