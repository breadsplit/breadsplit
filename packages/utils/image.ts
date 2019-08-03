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

export async function ResizeImage (file: File, MAX_WIDTH = 2048, MAX_HEIGHT = 2048) {
  const img = await getImage(file)

  const canvas = document.createElement('canvas')

  // eslint-disable-next-line
  let ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)

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
  canvas.width = width
  canvas.height = height

  // eslint-disable-next-line
  ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  return new Promise<Blob | null>((resolve) => {
    return canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9)
  })
}
