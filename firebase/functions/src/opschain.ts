// @ts-ignore
import JsCache from 'js-cache'
import { ProcessOperations, EvalTransforms, TransOperationOption } from 'opschain'
import { Transforms } from '../../../core/transforms'
import { Group, Operation } from '../../../types/models'

const transformCache = new JsCache()
const transformCacheTTL = 10 * 24 * 60 * 60 * 1000 // 10 days

// warpper functions
export function ProcessServerOperations(operations: TransOperationOption[], uid: string, server_timestamp?: number): Operation[] {
  return ProcessOperations(operations).map((o): Operation => {
    const op = {
      ...o,
      uid,
      server_timestamp: server_timestamp || +new Date(),
    }
    // undefined values is not acceptable in firestore
    if (op.meta === undefined)
      delete op.meta
    return op
  })
}

const _eval = EvalTransforms<Group>(Transforms, {
  cacheObject: transformCache,
  cacheTTL: transformCacheTTL,
  shouldCache: (operation) => {
    // skip caches that is too old
    return operation.timestamp + transformCacheTTL > +new Date()
  },
})

export function Eval(operations: Operation[]): Group {
  /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
  return _eval({} as Group, operations)
  /* eslint-enable @typescript-eslint/no-object-literal-type-assertion */
}
