import { imageProcessor, resize, sharpen, base64ToArrayBuffer, ResizeOptions, fileToBase64, applyExifOrientation } from 'ts-image-processor'

export async function resizeImageBlob(base64: string, options: ResizeOptions = { maxHeight: 2048, maxWidth: 2048 }) {
  return base64ToArrayBuffer(
    await imageProcessor
      .src(base64)
      .pipe(
        applyExifOrientation(),
        resize(options),
        sharpen(),
      ),
  )
}

export async function resizeImageFile(file: File, options?: ResizeOptions) {
  const base64 = await fileToBase64(file)
  return await resizeImageBlob(base64, options)
}
