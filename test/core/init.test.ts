import { MemberDefault, GroupDefault, TransactionDefault } from '~/utils/defaults'

describe('models initialization', () => {
  test('member', () => {
    const member = MemberDefault({ name: 'Hello' })
    expect(member.name).toEqual('Hello')
    expect(member.id.startsWith('m:')).toBeTruthy()
  })

  test('group', () => {
    const group = GroupDefault({
      name: 'Group A',
      members: [
        { name: 'Hello' },
      ],
    })
    expect(group.name).toEqual('Group A')
    expect(group.id).toBeTruthy()
    expect(group.members[0].name).toEqual('Hello')
  })

  test('tranaction', () => {
    const trans = TransactionDefault({
      desc: 'Trans A',
    })
    expect(trans.desc).toEqual('Trans A')
    expect(trans.id.startsWith('t:')).toBeTruthy()
    expect(trans.timestamp).toBeTruthy()
  })
})
