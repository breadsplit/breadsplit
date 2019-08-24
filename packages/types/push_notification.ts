export interface TokenRecord {
  token: string
  locale: string
  enabled: boolean
  uid?: string
}

export interface NotificationMessage {
  notification: {
    title: string
    icon?: string
    body?: string
    badge?: string

    type: string
    group?: string
    uid?: string
  }
  token: string
}
