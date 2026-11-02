export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality: number // 0.1 - 1.0
  format: 'image/webp' | 'image/jpeg' | 'image/png'
}

export interface CompressedImageResult {
  blob: Blob
  dataUrl: string
  width: number
  height: number
  originalSize: number
  compressedSize: number
  savingsPercent: number
}

export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        let width = img.width
        let height = img.height

        const maxWidth = options.maxWidth || width
        const maxHeight = options.maxHeight || height

        // Calculate aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto 2D'))
          return
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Fallo al comprimir la imagen'))
              return
            }
            const dataUrl = canvas.toDataURL(options.format, options.quality)
            const originalSize = file.size
            const compressedSize = blob.size
            const savingsPercent = Math.max(
              0,
              Math.round(((originalSize - compressedSize) / originalSize) * 100)
            )

            resolve({
              blob,
              dataUrl,
              width,
              height,
              originalSize,
              compressedSize,
              savingsPercent,
            })
          },
          options.format,
          options.quality
        )
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
