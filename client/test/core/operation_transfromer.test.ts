import * as ObjectHash from 'object-hash'
import { EvalTransforms, ProcessOperation, ProcessOperations, BasicCache } from '~/core'
import { TransformFunctions, SnapshotCache, TransOperation, TransOperationOption } from '~/types'

let transformCount = 0

class OperationChain<S> {
  base: Readonly<S>
  baseHash: string
  operations: TransOperation[]
  transforms: TransformFunctions<S>
  cache: SnapshotCache<S>

  constructor(baseSnapshot: S, transforms: TransformFunctions<S>, operations: TransOperationOption[] = []) {
    this.base = Object.freeze(baseSnapshot)
    this.baseHash = this.objectHash(this.base)
    this.transforms = transforms
    this.operations = []
    this.insertOperations(operations)
    this.cache = new BasicCache<S>()
  }

  objectHash(object: any) {
    return ObjectHash.sha1(object)
  }

  insertOperation(operation: TransOperationOption) {
    this.insertOperations([operation])
  }

  insertOperations(operations: TransOperationOption[]) {
    const processed = ProcessOperations(operations, this.objectHash)
    this.operations = this.operations.concat(processed).sort((a, b) => a.timestamp - b.timestamp)
  }

  eval(cache = true) {
    return EvalTransforms(
      this.transforms, {
        hashFunction: this.objectHash,
        cacheObject: cache ? this.cache : undefined,
      })(
      this.base,
      this.operations,
    )
  }
}

interface Snap {
  name: string
}

const transforms: TransformFunctions<Snap> = {
  upper(snap) {
    transformCount += 1
    snap.name = snap.name.toUpperCase()
    return snap
  },
  lower(snap) {
    transformCount += 1
    snap.name = snap.name.toLowerCase()
    return snap
  },
  slice(snap, args) {
    transformCount += 1
    const arg = args as number[]
    snap.name = snap.name.slice(...arg)
    return snap
  },
  prepend(snap, data) {
    transformCount += 1
    snap.name = data + snap.name
    return snap
  },
}

describe('demo', () => {
  it('no operation', () => {
    const snap: Snap = { name: 'hello' }
    const ops = new OperationChain<Snap>(snap, transforms)
    expect(ops.eval()).toEqual(snap)
  })

  it('basic', () => {
    const snap: Snap = { name: 'hello' }

    const ops = new OperationChain<Snap>(snap, transforms, [{ name: 'upper' }])

    expect(ops.objectHash(snap)).toEqual(ops.baseHash)

    expect(ops.eval()).toEqual({ name: 'HELLO' })
    // should be immutable
    expect(snap).toEqual({ name: 'hello' })

    ops.insertOperation({ name: 'lower' })
    expect(ops.eval()).toEqual({ name: 'hello' })

    ops.insertOperation({ name: 'slice', data: [1] })
    expect(ops.eval()).toEqual({ name: 'ello' })
  })

  it('string transform', () => {
    const snap: Snap = { name: 'hello' }

    const ops = new OperationChain<Snap>(snap, transforms, ['upper'])

    expect(ops.eval()).toEqual({ name: 'HELLO' })

    ops.insertOperation('lower')
    expect(ops.eval()).toEqual({ name: 'hello' })
  })

  it('cache on', () => {
    const snap: Snap = { name: 'hello' }

    transformCount = 0
    const ops = new OperationChain<Snap>(snap, transforms, ['upper'])

    ops.eval()
    expect(transformCount).toEqual(1)

    // use 1 cache, should only execute transform once
    transformCount = 0
    ops.insertOperation('lower')
    ops.eval()
    expect(transformCount).toEqual(1)

    // use cache, should not execute any transforms
    transformCount = 0
    const snap1 = ops.eval()
    expect(transformCount).toEqual(0)

    // consist result
    expect(ops.eval()).toEqual(snap1)
    expect(ops.eval()).toEqual(ops.eval())
    expect(transformCount).toEqual(0)

    transformCount = 0
    // should have same result without cache
    expect(ops.eval(false)).toEqual(snap1)
    expect(transformCount).toEqual(2)
  })

  it('cache off', () => {
    const snap: Snap = { name: 'hello' }

    const ops = new OperationChain<Snap>(snap, transforms, ['upper'])

    transformCount = 0
    ops.eval(false)
    expect(transformCount).toEqual(1)

    transformCount = 0
    ops.eval(false)
    expect(transformCount).toEqual(1)
  })

  it('order1', () => {
    const snap: Snap = { name: 'hello' }

    const ops = new OperationChain<Snap>(snap, transforms)

    ops.insertOperations([
      { name: 'prepend', data: '123' },
      { name: 'slice', data: [2] },
    ])

    expect(ops.eval()).toEqual({ name: '3hello' })
  })

  it('order2', () => {
    const snap: Snap = { name: 'hello' }

    const ops = new OperationChain<Snap>(snap, transforms)

    ops.insertOperations([
      { name: 'slice', data: [2] },
      { name: 'prepend', data: '123' },
    ])

    expect(ops.eval()).toEqual({ name: '123llo' })
  })

  it('will sort by timestamp', () => {
    const snap: Snap = { name: 'hello' }

    const ops = new OperationChain<Snap>(snap, transforms)

    ops.insertOperations([
      { name: 'slice', data: [2], timestamp: 2 },
      { name: 'prepend', data: '123', timestamp: 1 },
    ])

    expect(ops.eval()).toEqual({ name: '3hello' })
  })

  it('insert to head will not use cache', () => {
    const snap: Snap = { name: 'hello' }

    const ops = new OperationChain<Snap>(snap, transforms)

    ops.insertOperations([
      { name: 'slice', data: [2], timestamp: 3 },
      { name: 'prepend', data: '123', timestamp: 2 },
    ])

    transformCount = 0
    expect(ops.eval()).toEqual({ name: '3hello' })
    expect(transformCount).toBe(2)

    transformCount = 0
    ops.insertOperation({ name: 'upper', timestamp: 1 })
    expect(ops.eval()).toEqual({ name: '3HELLO' })
    expect(transformCount).toBe(3)
  })

  it('functional', () => {
    const snap: Snap = { name: 'hello' }

    const operation = ProcessOperation('upper')
    const result = EvalTransforms<Snap>(transforms)(snap, [operation])

    expect(snap).toEqual({ name: 'hello' })
    expect(result).toEqual({ name: 'HELLO' })
  })
})
