export type ReleaseChannel =
  | 'stable'
  | 'dev'
  | 'beta'

export type FirebaseServerName =
  | 'production'
  | 'development'
  | 'test'

export type BuildTarget =
  | 'web'
  | 'electron'

export const RELEASE_CHANNEL: ReleaseChannel
= (process.env.RELEASE_CHANNEL || 'dev') as ReleaseChannel

export const FIREBASE_SERVER: FirebaseServerName
= (process.env.FIREBASE_SERVER || 'development') as FirebaseServerName

export const DEBUG
= process.env.NODE_ENV !== 'production'

export const APP_VERSION
= process.env.APP_VERSION || ''

export const BUILD_TIME
= process.env.BUILD_TIME || ''

export const BUILD_TARGET: BuildTarget
= (process.env.BUILD_TARGET || 'web') as BuildTarget
