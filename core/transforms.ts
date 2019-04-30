import { TransformFunctions } from 'operation-sync'
import { Group } from '../types/models'

const Transforms: TransformFunctions<Group> = {
  rename(snap, name) {
    snap.name = (name || '').toString()
    return snap
  },
}

export default Transforms
