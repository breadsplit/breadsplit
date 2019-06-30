export * from '../../types'
export * from './store'

export interface SnackOptions {
  color?: string
  buttonColor?: string
  timeout?: number
  buttons?: {
    handler: () => void
    text: string
  }[]
}
