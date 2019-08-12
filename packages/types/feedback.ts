export interface FeedbackOptions {
  email: string | null
  content: string
}

export interface Feedback extends FeedbackOptions {
  uid: string | null
  timestamp: number
}
