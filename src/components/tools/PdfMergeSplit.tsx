import React, { useState } from 'react'
import { FileUp, Combine, Scissors, Download, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react'
import { mergePdfs, extractPdfPages, downloadBlob } from '../../utils/pdf'

export const PdfMergeSplit: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'merge' | 'split'>('merge')

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<File[]>([])
  const [isMerging, setIsMerging] = useState(false)

  // Split state
  const [splitFile, setSplitFile] = useState<File | null>(null)
  const [pageRange, setPageRange] = useState('1-2')
  const [isSplitting, setIsSplitting] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleMergeFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) => f.type === 'application/pdf')
      setMergeFiles((prev) => [...prev, ...selected])
      setError(null)
    }
  }

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...mergeFiles]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      const temp = newFiles[index]
      newFiles[index] = newFiles[targetIndex]
      newFiles[targetIndex] = temp
      setMergeFiles(newFiles)
    }
  }

  const removeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) {
      setError('Selecciona al menos 2 archivos PDF para unir.')
      return
    }
    try {
      setIsMerging(true)
      setError(null)
      const mergedBytes = await mergePdfs(mergeFiles)
      downloadBlob(mergedBytes, `unificado_${Date.now()}.pdf`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al unir los PDFs'
      setError(msg)
    } finally {
      setIsMerging(false)
    }
  }

  const handleExecuteSplit = async () => {
    if (!splitFile) {
      setError('Por favor selecciona un archivo PDF.')
      return
    }
    if (!pageRange.trim()) {
      setError('Por favor especifica el rango de páginas (ej: 1-3, 5).')
      return
    }
    try {
      setIsSplitting(true)
      setError(null)
      const extractedBytes = await extractPdfPages(splitFile, pageRange)
      downloadBlob(extractedBytes, `paginas_${pageRange.replace(/[\s,]+/g, '_')}_${splitFile.name}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al extraer páginas'
      setError(msg)
    } finally {
      setIsSplitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => {
            setActiveSubTab('merge')
            setError(null)
          }}
          className={`flex items-center gap-2 pb-3 px-4 font-medium text-sm border-b-2 transition-all ${
            activeSubTab === 'merge'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Combine className="w-4 h-4" />
          Unir PDFs (Merge)
        </button>
        <button
          onClick={() => {
            setActiveSubTab('split')
            setError(null)
          }}
          className={`flex items-center gap-2 pb-3 px-4 font-medium text-sm border-b-2 transition-all ${
            activeSubTab === 'split'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scissors className="w-4 h-4" />
          Dividir / Extraer Páginas
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MERGE SECTION */}
      {activeSubTab === 'merge' && (
        <div className="space-y-5">
          <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group">
            <input
              type="file"
              multiple
              accept="application/pdf"
              className="hidden"
              onChange={handleMergeFilesChange}
            />
            <FileUp className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 mb-3 transition-colors" />
            <p className="text-sm font-semibold text-slate-200">
              Haz clic para seleccionar o arrastra archivos PDF aquí
            </p>
            <p className="text-xs text-slate-500 mt-1">Puedes agregar varios documentos y ordenarlos</p>
          </label>

          {mergeFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Archivos en orden ({mergeFiles.length}):
              </h4>
              <div className="space-y-2">
                {mergeFiles.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-200 truncate">{f.name}</span>
                      <span className="text-xs text-slate-500 shrink-0">
                        ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveFile(idx, 'up')}
                        disabled={idx === 0}
                        title="Subir"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(idx, 'down')}
                        disabled={idx === mergeFiles.length - 1}
                        title="Bajar"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(idx)}
                        title="Eliminar"
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExecuteMerge}
                  disabled={isMerging || mergeFiles.length < 2}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Download className="w-4 h-4" />
                  {isMerging ? 'Uniendo archivos...' : 'Descargar PDF Unificado'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SPLIT SECTION */}
      {activeSubTab === 'split' && (
        <div className="space-y-5">
          {!splitFile ? (
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSplitFile(e.target.files[0])
                    setError(null)
                  }
                }}
              />
              <FileUp className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 mb-3 transition-colors" />
              <p className="text-sm font-semibold text-slate-200">
                Selecciona el PDF del cual deseas extraer páginas
              </p>
            </label>
          ) : (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">{splitFile.name}</h4>
                  <p className="text-xs text-slate-500">
                    {(splitFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSplitFile(null)}
                  className="text-xs text-slate-400 hover:text-rose-400"
                >
                  Cambiar archivo
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Rango de páginas a extraer:
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="ej: 1-3, 5, 8-10"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-xs text-slate-500">
                  Usa guiones para rangos y comas para páginas individuales (ej: `1-3, 5, 7-9`).
                </p>
              </div>

              <button
                onClick={handleExecuteSplit}
                disabled={isSplitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all"
              >
                <Scissors className="w-4 h-4" />
                {isSplitting ? 'Extrayendo páginas...' : 'Extraer y Descargar PDF'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
