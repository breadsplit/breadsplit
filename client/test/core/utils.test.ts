import trimChar from '~/utils/trimChar'
import randomstr from '~/../core/randomstr'

describe('trimChar', () => {
  it('trim spaces by defaults', () => {
    expect(trimChar(' hello ')).toEqual('hello')
    expect(trimChar('world')).toEqual('world')
  })

  it('trim comma', () => {
    expect(trimChar(',hello,', ',')).toEqual('hello')
    expect(trimChar('world,', ',')).toEqual('world')
  })
})

describe('randomstr', () => {
  it('not equal', () => {
    expect(randomstr()).not.toEqual(randomstr())
  })

  it('length', () => {
    expect(randomstr(5)).toHaveLength(5)
    expect(randomstr(100)).toHaveLength(100)
  })
})
