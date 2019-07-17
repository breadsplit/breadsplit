import { writeFileSync, readFileSync } from 'fs'
import path from 'path'
import { NuxtModuleContext } from './type'

function render (template: string, object: object) {
  let a = template
  for (const key of Object.keys(object))
    a = a.replace(new RegExp(`\\{{${key}\\}}`, 'g'), object[key])
  return a
}

async function build (context: NuxtModuleContext, moduleOptions: any) {
  const srcDir = context.options.srcDir || ''
  const templatePath = path.resolve(srcDir, 'modules', 'firebase-messaging.template.sw.js')
  const outputPath = path.resolve(srcDir, 'static', 'firebase-messaging.sw.js')

  const template = readFileSync(templatePath, 'utf-8')
  const script = render(template, {
    messagingSenderId: '918223121466',
  })
  writeFileSync(outputPath, script, 'utf-8')
}

export default async function (this: NuxtModuleContext, moduleOptions: any) {
  const hook = async () => {
    await build(this, moduleOptions)
  }

  if (this.options.mode === 'spa')
    return await hook()

  this.nuxt.hook('build:before', hook)
}
