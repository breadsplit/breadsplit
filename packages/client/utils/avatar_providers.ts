import * as d3 from 'd3'
import { rgbStringToHex } from './colors'
import { hashCode } from '~/../utils'

const spectral = d3.quantize(t => d3.interpolateSpectral(t), 100)

export function LetterAvatar (name = '', hash = '', size = 200, font = 'Arial') {
  hash = hash || name

  const nameSplit = String(name).toUpperCase().split(' ')
  let initials: string

  if (nameSplit.length === 1)
    initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?'

  else
    initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0)

  if (window.devicePixelRatio)
    size = (size * window.devicePixelRatio)

  const colorIndex = Math.abs(hashCode(hash)) % spectral.length
  const color = `#${rgbStringToHex(spectral[colorIndex])}`
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const context = canvas.getContext('2d')!

  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.font = `${Math.round(canvas.width / 2)}px ${font}`
  context.textAlign = 'center'
  context.fillStyle = '#FFF'
  context.fillText(initials, size / 2, size / 1.5)

  const dataURI = canvas.toDataURL()

  return dataURI
}
