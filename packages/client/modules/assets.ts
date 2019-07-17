import * as path from 'path'
import fs from 'fs-extra'
import { RELEASE_CHANNEL } from '../../meta/env'
import { NuxtModuleContext } from './type'

const assetPath = '../../../assets'
const staticPath = '../static'

async function clear (context: NuxtModuleContext, moduleOptions: any) {
  await fs.remove(path.resolve(__dirname, staticPath, 'img/logo'))
  await fs.remove(path.resolve(__dirname, staticPath, 'img/brands'))
}

async function copyLogo (context: NuxtModuleContext, moduleOptions: any) {
  const logoFolderName = RELEASE_CHANNEL === 'dev' ? 'logo-dev' : 'logo'
  const from = path.resolve(__dirname, assetPath, logoFolderName)
  const to = path.resolve(__dirname, staticPath, 'img/logo')
  await fs.copy(from, to)
}

async function copyBrands (context: NuxtModuleContext, moduleOptions: any) {
  const from = path.resolve(__dirname, assetPath, 'brands')
  const to = path.resolve(__dirname, staticPath, 'img/brands')
  await fs.copy(from, to)
}

export default async function (this: NuxtModuleContext, moduleOptions: any) {
  const hook = async () => {
    await clear(this, moduleOptions)
    await copyLogo(this, moduleOptions)
    await copyBrands(this, moduleOptions)
  }

  if (this.options.mode === 'spa')
    return await hook()

  this.nuxt.hook('build:before', hook)
}
