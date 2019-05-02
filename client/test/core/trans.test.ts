import { TransactionDefault } from '~/utils/defaults'
import { TransactionBalanceChanges } from '~/../core'

describe('transaction balances', () => {
  const trans = TransactionDefault({
    desc: 'Trans A',
    currency: 'USD',
    total_fee: 300,
    creditors: [{
      memberId: '1',
      weight: 1,
    }],
    debtors: [{
      memberId: '2',
      weight: 2,
    },
    {
      memberId: '1',
      weight: 1,
    }],
  })
  const balances = TransactionBalanceChanges(trans)

  test('balances order', () => {
    expect(balances).toHaveLength(2)
    expect(balances[0].memberId).toEqual('1')
    expect(balances[1].memberId).toEqual('2')
  })

  test('member 1', () => {
    const member1 = balances[0]
    expect(member1.memberId).toEqual('1')
    expect(member1.credit_weight).toEqual(1)
    expect(member1.credit).toEqual(300)
    expect(member1.debt).toEqual(100)
    expect(member1.balance).toEqual(300 - 100)
  })

  test('member 2', () => {
    const member2 = balances[1]
    expect(member2.memberId).toEqual('2')
    expect(member2.credit_weight).toEqual(0)
    expect(member2.credit).toEqual(0)
    expect(member2.debt).toEqual(200)
    expect(member2.balance).toEqual(-200)
  })
})
