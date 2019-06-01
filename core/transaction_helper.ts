import { Transaction, Weight } from '../types'
import { GCD } from '.'

export type WeightsField = 'debtors' | 'creditors'
export type Splitmode = 'average' | 'amount' | 'percent' | 'weight'

export class TransactionWeightsHelper {
  public trans: Transaction
  public on: WeightsField

  constructor(trans: Transaction, on: WeightsField) {
    this.trans = trans
    this.on = on
  }

  get participators() {
    return this.trans[this.on]
  }

  set participators(value: Weight[]) {
    this.trans[this.on] = value
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
    if (participator.fee != null)
      return participator.fee
    if (!this.flexibleWeights)
      return 0
    return ((participator.weight || 0) / (this.flexibleWeights || 1)) * (this.flexibleFees)
  }

  gcd() {
    if (this.participators.length === 1) {
      this.participators[0].weight = 1
      return
    }
    const participators = this.participators.map(c => ({
      uid: c.uid,
      fee: this.getFee(c),
    }))
    const gcd = GCD(participators.map(c => c.fee))
    this.participators.forEach((c) => {
      const participator = participators.find(d => d.uid === c.uid)
      if (participator && participator.fee != null)
        c.weight = participator.fee / gcd
    })
  }

  cleanUp(mode: Splitmode, removeZero = true) {
    if (mode === 'average') {
      this.participators.forEach((c) => {
        c.weight = c.weight ? 1 : 0
      })
    }
    else if (mode === 'percent') {
      this.participators.forEach((c) => {
        c.weight = c.percent || c.weight || 0
      })
      this.gcd()
    }
    else {
      this.gcd()
    }

    this.participators.forEach((c) => {
      delete c.fee
      delete c.percent
    })

    if (removeZero)
      this.participators = this.participators.filter(c => c.weight)
  }
}
