import cloneDeep from 'lodash/cloneDeep'
// @ts-ignore
import rusha from 'rusha'
import stringify from 'json-stable-stringify'
import { SnapshotCache, TransOperation, TransformFunctions, OpschainOption, TransOperationOption } from '../types'

export class BasicCache<S> implements SnapshotCache<S> {
  _cache: {[key: string]: S}
  constructor (cache: {[key: string]: S} = {}) {
    this._cache = cache
  }
  get (key: string): S {
    return this._cache[key]
  }
  set (key: string, snap: S): void {
    this._cache[key] = snap
  }
}

function basicHashFunction (object: any): string {
  const hash = rusha.createHash()
  hash.update(stringify(object))
  return hash.digest('hex')
}

export function TreeHash (
  operations: TransOperation[],
  baseHash: string,
  operationIndex: number,
  hashFunction: (object: any) => string
) {
  const operationHashes = operations
    .slice(0, operationIndex)
    .map(op => op.hash)
  return hashFunction({
    baseHash,
    operations: operationHashes,
  })
}

export function EvalTransforms<S> (
  transforms: TransformFunctions<S>,
  options?: OpschainOption<S>
) {
  const {
    hashFunction,
    cacheObject,
    cacheTTL,
    shouldCache,
  } = Object.assign({
    hashFunction: basicHashFunction,
    shouldCache: () => true,
  }, options || {})

  return (
    base: S,
    operations: TransOperation[],
  ) => {
    let snap = base
    const baseHash = hashFunction(base)
    let snapIndex = 0
    const treeHash = (index: number) => TreeHash(operations, baseHash, index, basicHashFunction)

    if (cacheObject) {
      // search reverse
      for (let index = operations.length; index >= 0; index -= 1) {
        const hash = treeHash(index)
        if (cacheObject.get(hash)) {
          snap = cacheObject.get(hash)
          snapIndex = index
          break
        }
      }
    }

    for (let index = snapIndex; index < operations.length; index += 1) {
      const operation = operations[index]
      const result = transforms[operation.name](cloneDeep(snap), operation.data, operation.meta)
      const hash = treeHash(index + 1)
      if (cacheObject && shouldCache(operation, result, snap))
        cacheObject.set(hash, Object.freeze(result), cacheTTL)

      snap = result
    }
    return snap
  }
}

export function ProcessOperations (operations: TransOperationOption[], hashFunction = basicHashFunction): TransOperation[] {
  return operations.map((operation) => {
    if (typeof operation === 'string') {
      return {
        name: operation,
        timestamp: +new Date(),
        hash: hashFunction({ action: operation }),
      }
    }
    else {
      return {
        name: operation.name,
        data: Object.freeze(operation.data),
        meta: Object.freeze(operation.meta),
        timestamp: operation.timestamp || +new Date(),
        hash: hashFunction({ action: operation.name, data: operation.data, meta: operation.meta }),
      }
    }
  })
}

export function ProcessOperation (operation: TransOperationOption, hashFunction = basicHashFunction): TransOperation {
  return ProcessOperations([operation], hashFunction)[0]
}
