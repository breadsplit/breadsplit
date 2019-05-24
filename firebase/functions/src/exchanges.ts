import axios from 'axios'
import { config } from 'firebase-functions'
import dayjs from '../../../core/dayjs_config'

// firebase functions:config:set fixer.token="xxx"

const FIXER_TOKEN = (config().fixer || {}).token
const API_URL = (date: string) => `http://data.fixer.io/api/${date}?access_key=${FIXER_TOKEN}`

export interface ExchangeRecord {
  base: string
  date: string
  rates: Record<string, number>
  timestamp: number
  provider: 'fixer'
}

export function formatDate(date?: number | string) {
  return dayjs(date).format('YYYY-MM-DD')
}

export async function queryExchangeRates(date?: number | string): Promise<ExchangeRecord|undefined> {
  const date_string = formatDate(date)
  try {
    const r = await axios.get(API_URL(date_string))
    if (r.data.success === true) {
      return Object.assign({}, r.data, {
        provider: 'fixer',
      }) as ExchangeRecord
    }
  }
  catch {}
  return undefined
}
