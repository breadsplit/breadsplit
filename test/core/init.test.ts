import { MemberDefault } from '~/types/defaults'

describe('models initialization', () => {
  test('member', () => {
    const member = MemberDefault({ name: 'Hello' })
    expect(member.name).toEqual('Hello')
    expect(member.id.startsWith('m:')).toBeTruthy()
  })
})
