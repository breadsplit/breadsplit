export function getImage (file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    const reader = new FileReader()
    reader.onload = (e) => {
      // @ts-ignore
      img.src = (e.target && e.target.result) || ''
      img.onload = () => resolve(img)
    }
    reader.readAsDataURL(file)
  })
}

export async function getImageOrientation (file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event: ProgressEvent) => {
      if (!event.target)
        return

      const file = event.target as FileReader
      const view = new DataView(file.result as ArrayBuffer)

      if (view.getUint16(0, false) !== 0xFFD8)
        return resolve(-2)

      const length = view.byteLength
      let offset = 2

      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8)
          return resolve(-1)

        const marker = view.getUint16(offset, false)
        offset += 2

        if (marker === 0xFFE1) {
          offset += 2
          if (view.getUint32(offset, false) !== 0x45786966)
            return resolve(-1)

          const little = view.getUint16(offset += 6, false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          const tags = view.getUint16(offset, little)
          offset += 2
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + (i * 12), little) === 0x0112)
              return resolve(view.getUint16(offset + (i * 12) + 8, little))
          }
        }
        else if ((marker & 0xFF00) !== 0xFF00) {
          break
        }
        else {
          offset += view.getUint16(offset, false)
        }
      }
      return resolve(-1)
    }

    reader.readAsArrayBuffer(file)
  })
}

export async function resizeImage (file: File, MAX_WIDTH = 2048, MAX_HEIGHT = 2048) {
  const img = await getImage(file)
  const orientation = await getImageOrientation(file)
  const canvas = document.createElement('canvas')

  console.log('orientation', orientation)

  let width = img.width
  let height = img.height

  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width
      width = MAX_WIDTH
    }
  }
  else {
    if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height
      height = MAX_HEIGHT
    }
  }

  if (orientation > 4 && orientation < 9)
    [height, width] = [width, height]

  canvas.width = width
  canvas.height = height

  // eslint-disable-next-line
  let ctx = canvas.getContext('2d')!

  // transform context before drawing image
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break
    case 3: ctx.transform(-1, 0, 0, -1, width, height); break
    case 4: ctx.transform(1, 0, 0, -1, 0, height); break
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break
    case 6: ctx.transform(0, 1, -1, 0, width, 0); break
    case 7: ctx.transform(0, -1, -1, 0, width, height); break
    case 8: ctx.transform(0, -1, 1, 0, 0, height); break
    default: break
  }

  ctx.drawImage(img, 0, 0, width, height)

  return new Promise<Blob | null>((resolve) => {
    return canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9)
  })
}
