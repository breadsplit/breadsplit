import { FIREBASE_SERVER } from './env'

let host = 'https://app.breadsplit.com'

if (FIREBASE_SERVER === 'development')
  host = 'https://dev.breadsplit.com'

export const SERVER_HOST = host
