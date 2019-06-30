import { TransactionDefault, TransactionBalanceChanges } from '../../../packages/core'

describe('transaction balances', () => {
  const trans = TransactionDefault({
    desc: 'Trans A',
    currency: 'USD',
    total_fee: 300,
    creditors: [{
      uid: '1',
      weight: 1,
    }],
    debtors: [{
      uid: '2',
      weight: 2,
    },
    {
      uid: '1',
      weight: 1,
    }],
  })
  const balances = TransactionBalanceChanges(trans)

  test('balances order', () => {
    expect(balances).toHaveLength(2)
    expect(balances[0].uid).toEqual('1')
    expect(balances[1].uid).toEqual('2')
  })

  test('member 1', () => {
    const member1 = balances[0]
    expect(member1.uid).toEqual('1')
    expect(member1.credit_weight).toEqual(1)
    expect(member1.credit.equals(300)).toBeTruthy()
    expect(member1.debt.equals(100)).toBeTruthy()
    expect(member1.balance.equals(300 - 100)).toBeTruthy()
  })

  test('member 2', () => {
    const member2 = balances[1]
    expect(member2.uid).toEqual('2')
    expect(member2.credit_weight).toEqual(0)
    expect(member2.credit.equals(0)).toBeTruthy()
    expect(member2.debt.equals(200)).toBeTruthy()
    expect(member2.balance.equals(-200)).toBeTruthy()
  })
})
