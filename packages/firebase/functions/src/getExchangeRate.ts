import { config } from 'firebase-functions'
import dayjs, { Dayjs } from 'dayjs'
import axios from 'axios'

import { f, ExchangeRef } from './utils/helpers'
import { ExchangeRecord } from './utils/types'

// firebase functions:config:set fixer.token="xxx"
const FIXER_TOKEN = (config().fixer || {}).token
const API_URL = (date: string) => `http://data.fixer.io/api/${date}?access_key=${FIXER_TOKEN}`

function formatDate(date?: number | string | Dayjs) {
  return dayjs(date).format('YYYY-MM-DD')
}

async function queryExchangeRates(date?: number | string): Promise<ExchangeRecord | undefined> {
  const date_string = formatDate(date)
  try {
    const r = await axios.get(API_URL(date_string))
    if (r.data.success === true) {
      return Object.assign({}, r.data, {
        provider: 'fixer',
      }) as ExchangeRecord
    }
  }
  catch { }
  return undefined
}

export const getExchangeRate = f(async({ date } = {}, context) => {
  const d = dayjs(date)
  if (d.isBefore('2019-01-01'))
    return undefined
  if (d.isAfter(dayjs(), 'day'))
    return undefined

  date = formatDate(d)
  const doc = await ExchangeRef(date).get()
  if (doc.exists)
    return doc.data()

  const data = await queryExchangeRates(date)
  if (data)
    await ExchangeRef(date).set(data)
  return data
})
