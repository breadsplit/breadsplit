import { mutations, getters } from '~/store/group'
import { RootStateDefault, GroupStateDefault } from '~/utils/defaults'
import { GroupState } from '~/types/store'

describe('group state getters', () => {
  it('current', () => {
    const state = GroupStateDefault()
    const rootState = RootStateDefault({
      group: state,
    })
    expect(getters.current(state, null, rootState, null)).toBeUndefined()
  })
})

describe('group state mutations', () => {
  let state: GroupState
  let groupsAmount = 0

  beforeEach(() => {
    state = GroupStateDefault()
    mutations.add(state, {
      name: 'group1',
      id: 'group1',
    })
    groupsAmount = 1
  })

  it('setup test', () => {
    expect(Object.keys(state.groups).length).toEqual(groupsAmount)
    expect(state.groups).toHaveProperty('group1')
    expect(state.groups.group1.name).toEqual('group1')
  })

  it('add edit remove', () => {
    // Add
    mutations.add(state, {
      name: 'test',
      id: 'test',
    })
    expect(Object.keys(state.groups).length).toEqual(groupsAmount + 1)
    expect(state.groups).toHaveProperty('test')
    expect(state.groups.test.name).toEqual('test')
    expect(state.groups.test.icon).toBeFalsy()

    // Edit
    mutations.edit(state, {
      id: 'test',
      changes: {
        name: 'hello',
        icon: 'bar',
      },
    })
    expect(state.groups.test.name).toEqual('hello')
    expect(state.groups.test.icon).toEqual('bar')

    // Remove
    mutations.remove(state, 'test')
    expect(Object.keys(state.groups).length).toEqual(groupsAmount)
    expect(state.groups).not.toHaveProperty('test')
  })

  it('members', () => {
    const group = state.groups.group1
    expect(Object.keys(group.members)).toHaveLength(0)

    // Add
    mutations.addMember(state, { id: 'group1', member: { id: 'member1', name: 'member1' } })
    expect(Object.keys(group.members)).toHaveLength(1)
    expect(group.members).toHaveProperty('member1')
    expect(group.members.member1).toHaveProperty('name', 'member1')
  })
})
