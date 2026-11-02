import React, { useState } from 'react'
import { Image as ImageIcon, Sliders, Download, Sparkles, CheckCircle2 } from 'lucide-react'
import { compressImage, formatBytes, type CompressedImageResult } from '../../utils/image'

export const ImageCompressor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [quality, setQuality] = useState<number>(0.8)
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp')
  const [maxWidth, setMaxWidth] = useState<number>(1920)
  const [result, setResult] = useState<CompressedImageResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setResult(null)
      processImage(file, quality, format, maxWidth)
    }
  }

  const processImage = async (
    file: File,
    q: number,
    f: 'image/webp' | 'image/jpeg' | 'image/png',
    maxW: number
  ) => {
    try {
      setIsProcessing(true)
      const res = await compressImage(file, {
        quality: q,
        format: f,
        maxWidth: maxW,
      })
      setResult(res)
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ)
    if (selectedFile) {
      processImage(selectedFile, newQ, format, maxWidth)
    }
  }

  const handleFormatChange = (newF: 'image/webp' | 'image/jpeg' | 'image/png') => {
    setFormat(newF)
    if (selectedFile) {
      processImage(selectedFile, quality, newF, maxWidth)
    }
  }

  const handleDownload = () => {
    if (!result || !selectedFile) return
    const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png'
    const originalNameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name
    const fileName = `${originalNameWithoutExt}_comprimida.${ext}`

    const a = document.createElement('a')
    a.href = result.dataUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <ImageIcon className="w-12 h-12 text-slate-400 group-hover:text-cyan-400 mb-3 transition-colors" />
          <p className="text-base font-semibold text-slate-200">
            Arrastra tu imagen o haz clic para subir
          </p>
          <p className="text-xs text-slate-500 mt-1">Soporta PNG, JPG y WebP (Procesado 100% en tu navegador)</p>
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Ajustes de Compresión
              </span>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setResult(null)
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Cambiar foto
              </button>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Calidad</span>
                <span className="text-cyan-400 font-bold">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Target Format */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Formato de Salida</label>
              <div className="grid grid-cols-3 gap-2">
                {(['image/webp', 'image/jpeg', 'image/png'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleFormatChange(fmt)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      format === fmt
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {fmt.replace('image/', '').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Width */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">
                Ancho Máximo (px)
              </label>
              <select
                value={maxWidth}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10)
                  setMaxWidth(val)
                  if (selectedFile) processImage(selectedFile, quality, format, val)
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value={3840}>4K (3840px)</option>
                <option value={1920}>Full HD (1920px)</option>
                <option value={1280}>HD (1280px)</option>
                <option value={800}>Web Medium (800px)</option>
                <option value={500}>Thumbnail (500px)</option>
              </select>
            </div>

            {/* Download Button */}
            {result && (
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all mt-4"
              >
                <Download className="w-4 h-4" />
                Descargar Imagen
              </button>
            )}
          </div>

          {/* Preview & Stats Column */}
          <div className="lg:col-span-2 space-y-4">
            {result && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block">Tamaño Original</span>
                  <span className="text-sm font-semibold text-slate-300 mt-1 block">
                    {formatBytes(result.originalSize)}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block">Tamaño Final</span>
                  <span className="text-sm font-semibold text-cyan-300 mt-1 block">
                    {formatBytes(result.compressedSize)}
                  </span>
                </div>
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs text-emerald-400 block font-medium">Ahorro</span>
                    <span className="text-sm font-bold text-emerald-300">
                      -{result.savingsPercent}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Image Preview Canvas / Container */}
            <div className="border border-slate-800 rounded-2xl bg-slate-950 p-4 flex items-center justify-center min-h-[300px] overflow-hidden relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-10">
                  <span className="text-xs text-cyan-400 animate-pulse font-medium">
                    Comprimiendo imagen...
                  </span>
                </div>
              )}
              {result ? (
                <img
                  src={result.dataUrl}
                  alt="Resultado de compresión"
                  className="max-h-[360px] max-w-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <span className="text-xs text-slate-500">Cargando vista previa...</span>
              )}
            </div>

            {result && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Dimensiones finales: {result.width} x {result.height}px
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
