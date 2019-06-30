import axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import { config } from 'firebase-functions'
import { ExchangeRecord } from '../../../types'

// firebase functions:config:set fixer.token="xxx"

const FIXER_TOKEN = (config().fixer || {}).token
const API_URL = (date: string) => `http://data.fixer.io/api/${date}?access_key=${FIXER_TOKEN}`

export function formatDate(date?: number | string | Dayjs) {
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
