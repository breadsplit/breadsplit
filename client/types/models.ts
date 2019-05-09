export * from '../../types/models'

export interface SnackOptions {
  color?: string
  buttonColor?: string
  timeout?: number
  buttons?: {
    handler: () => void
    text: string
  }[]
}
