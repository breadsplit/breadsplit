import { Group } from './types'

export function GroupCleanUp(group: Group) {
  if (!group.exchange_rates)
    group.exchange_rates = {}
  for (const transaction of group.transactions) {
    // @ts-ignore
    if (transaction.exchange_rate) {
      // @ts-ignore
      group.exchange_rates[transaction.exchange_rate.date] = transaction.exchange_rate
      // @ts-ignore
      delete transaction.exchange_rate
    }
  }
  return group
}
