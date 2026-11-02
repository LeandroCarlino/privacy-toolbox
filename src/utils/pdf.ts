import { PDFDocument } from 'pdf-lib'

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create()

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => mergedPdf.addPage(page))
  }

  return await mergedPdf.save()
}

export async function extractPdfPages(file: File, pageRangesStr: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer()
  const sourcePdf = await PDFDocument.load(arrayBuffer)
  const totalPages = sourcePdf.getPageCount()

  const targetPages = new Set<number>()
  const parts = pageRangesStr.split(',').map((p) => p.trim())

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          targetPages.add(i - 1)
        }
      }
    } else {
      const pageNum = parseInt(part, 10)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        targetPages.add(pageNum - 1)
      }
    }
  }

  const indicesToCopy = Array.from(targetPages).sort((a, b) => a - b)
  if (indicesToCopy.length === 0) {
    throw new Error('No se seleccionaron páginas válidas dentro del rango del PDF.')
  }

  const newPdf = await PDFDocument.create()
  const copiedPages = await newPdf.copyPages(sourcePdf, indicesToCopy)
  copiedPages.forEach((page) => newPdf.addPage(page))

  return await newPdf.save()
}

export function downloadBlob(data: Uint8Array | Blob, fileName: string, mimeType = 'application/pdf') {
  const blob = data instanceof Blob ? data : new Blob([data as unknown as BlobPart], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
