import { sumBy, uniq, concat, map, merge, find } from 'lodash'
import Fraction from 'fraction.js'
import { Transaction, Weight, TransactionBalance } from '../types'
import { GCD } from '../utils'

export type WeightsField = 'debtors' | 'creditors'

export class TransactionWeightsHelper {
  constructor(
    public trans: Transaction,
    public readonly on: WeightsField,
  ) { }

  get mode() {
    if (this.on === 'creditors')
      return this.trans.splitmode_creditors
    else
      return this.trans.splitmode
  }

  get participators() {
    return this.trans[this.on]
  }

  set participators(value: Weight[]) {
    this.trans[this.on] = value
  }

  get totalWeights() {
    return this.participators
      .map(i => i.weight || 0)
      .reduce((a, b) => a + b, 0)
  }

  get flexibleWeights() {
    return this.participators
      .filter(c => c.fee == null)
      .map(i => i.weight || 0)
      .reduce((a, b) => a + b, 0)
  }

  get fixedFees() {
    return this.participators
      .filter(c => c.fee != null)
      .map(i => i.fee || 0)
      .reduce((a, b) => a + b, 0)
  }

  get flexibleFees() {
    return this.trans.total_fee - this.fixedFees
  }

  getFee(participator: Weight) {
    if (this.mode === 'amount') {
      if (participator.fee != null)
        return participator.fee
      if (!this.flexibleWeights)
        return 0
      return ((participator.weight || 0) / (this.flexibleWeights || 1)) * (this.flexibleFees)
    }
    if (this.mode === 'percent') {
      const totalPercents = sumBy(this.participators, p => p.percent || 0)
      return this.trans.total_fee * (participator.percent || 0) / totalPercents
    }
    if (this.mode === 'average') {
      const total = sumBy(this.participators, p => p.weight ? 1 : 0)
      return participator.weight ? this.trans.total_fee / total : 0
    }
    const totalWeights = sumBy(this.participators, p => p.weight || 0)
    return this.trans.total_fee * (participator.weight || 0) / totalWeights
  }

  gcdAmount() {
    if (this.participators.length === 1) {
      this.participators[0].weight = 1
      return
    }
    const participators = this.participators.map(c => ({
      uid: c.uid,
      fee: this.getFee(c),
    }))
    const gcd = GCD(participators.map(c => c.fee).filter(i => i))
    this.participators.forEach((c) => {
      const participator = participators.find(d => d.uid === c.uid)
      if (participator && participator.fee != null)
        c.weight = participator.fee / gcd
    })
  }

  gcdWeight() {
    if (this.participators.length === 1) {
      this.participators[0].weight = 1
      return
    }
    const gcd = GCD(this.participators.map(c => c.weight || 0).filter(i => i))
    this.participators.forEach((c) => {
      c.weight = (c.weight || 0) / gcd
    })
  }

  cleanUp(removeZero = true) {
    const mode = this.mode
    if (mode === 'average') {
      this.participators.forEach((c) => {
        c.weight = c.weight ? 1 : 0
      })
    }
    else if (mode === 'percent') {
      this.participators.forEach((c) => {
        let value = c.percent
        if (value == null)
          value = c.weight
        if (value == null)
          value = 0
        c.weight = value
      })
      this.gcdWeight()
    }
    else if (mode === 'weight') {
      this.gcdWeight()
    }
    else if (mode === 'amount') {
      this.gcdAmount()
    }

    this.participators.forEach((c) => {
      delete c.fee
      delete c.locked
    })

    if (removeZero)
      this.participators = this.participators.filter(c => c.weight)
  }
}

export class TransactionHelper {
  static from(trans: Transaction) {
    return new TransactionHelper(trans)
  }

  constructor(
    public trans: Transaction,
  ) { }

  get creditorsHelper() {
    return new TransactionWeightsHelper(this.trans, 'creditors')
  }

  get debtorsHelper() {
    return new TransactionWeightsHelper(this.trans, 'debtors')
  }

  get creditorWeights(): number {
    return sumBy(this.trans.creditors, c => c.weight || 0)
  }

  get debtorWeights(): number {
    return sumBy(this.trans.debtors, d => d.weight || 0)
  }

  get involvedIds() {
    return uniq(concat(map(this.trans.creditors, 'uid'), map(this.trans.debtors, 'uid')))
  }

  get balanceChanges(): TransactionBalance[] {
    const fee = this.trans.total_fee
    const creditorWeights = this.creditorWeights
    const debtorWeights = this.debtorWeights
    const involvedIds = this.involvedIds

    const changes = involvedIds.map((uid): TransactionBalance => {
      const credit_weight = merge({ weight: 0 }, find(this.trans.creditors, { uid })).weight
      const debt_weight = merge({ weight: 0 }, find(this.trans.debtors, { uid })).weight
      const credit = new Fraction(fee).mul(credit_weight).div(creditorWeights)
      const debt = new Fraction(fee).mul(debt_weight).div(debtorWeights)
      const balance = credit.sub(debt)
      return {
        uid,
        credit_weight,
        debt_weight,
        credit,
        debt,
        balance,
      }
    })

    return changes
  }

  balanceChangesOf(uid: string) {
    return this.balanceChanges.find(i => i.uid === uid)
  }

  cleanUp() {
    this.debtorsHelper.cleanUp()
    this.creditorsHelper.cleanUp()
  }
}
