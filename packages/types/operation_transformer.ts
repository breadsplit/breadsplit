export type TransformFunction<S> = (snap: S, data?: any, meta?: any) => S

export interface TransformFunctions<S> { [s: string]: TransformFunction<S> }

export interface TransOperation {
  name: string
  data?: any
  meta?: any
  timestamp: number
  hash: string
}

export type TransOperationOption = {
  name: string
  data?: any
  meta?: any
  timestamp?: number
} | string

export interface SnapshotCache<S> {
  get(key: string): S
  set(key: string, snap: S, ttl?: number): void
}

export interface OpschainOption<S> {
  hashFunction?(object: any): string
  cacheObject?: SnapshotCache<S>
  cacheTTL?: number
  shouldCache?(operation: TransOperation, snap: S, previousSanp: S): boolean
}
