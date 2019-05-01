import { MemberDefault, GroupDefault, TransactionDefault } from '~/utils/defaults'

describe('models initialization', () => {
  test('member', () => {
    const member = MemberDefault({ name: 'Hello' })
    expect(member.name).toEqual('Hello')
    expect(member.id.startsWith('lm-')).toBeTruthy()
  })

  test('group', () => {
    const group = GroupDefault({
      name: 'Group A',
      members: [
        { id: 'member1', name: 'Hello' },
      ],
    })
    expect(group.name).toEqual('Group A')
    expect(group.id).toBeTruthy()
    expect(typeof group.members).toEqual('object')
    expect(group.members.member1.name).toEqual('Hello')
  })

  test('tranaction', () => {
    const trans = TransactionDefault({
      desc: 'Trans A',
    })
    expect(trans.desc).toEqual('Trans A')
    expect(trans.id.startsWith('t-')).toBeTruthy()
    expect(trans.timestamp).toBeTruthy()
  })
})
