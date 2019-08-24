export interface TokenRecord {
  token: string
  locale: string
  enabled: boolean
  uid?: string
}

export interface NotificationMessage {
  notification: {
    type: string
    title: string
    body?: string
    group?: string
    uid?: string
    avatar?: string
  }
  token: string
}
