import path from 'path'
import AssetsModuleFactor from '../../shared/modules/assets'

export default AssetsModuleFactor(
  path.resolve(__dirname, '../../../assets'),
  path.resolve(__dirname, '../static')
)
