import React, { useState } from 'react'
import { Copy, Check, FileDown, Sparkles, AlertCircle } from 'lucide-react'
import {
  jsonToTypeScript,
  jsonToCsv,
  jsonToSql,
  formatJson,
  minifyJson,
} from '../../utils/jsonConverters'

const SAMPLE_JSON = JSON.stringify(
  [
    {
      id: 1,
      nombre: 'Leandro Carlino',
      rol: 'Software Engineer',
      habilidades: ['React', 'TypeScript', 'Node.js', 'Python'],
      activo: true,
      salario: 4500,
      metadata: { pais: 'Argentina', remoto: true },
    },
    {
      id: 2,
      nombre: 'Sofia Martinez',
      rol: 'Frontend Architect',
      habilidades: ['Vue', 'Astro', 'Tailwind'],
      activo: true,
      salario: 5200,
      metadata: { pais: 'España', remoto: true },
    },
  ],
  null,
  2
)

export const JsonConverter: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON)
  const [output, setOutput] = useState<string>('')
  const [activeMode, setActiveMode] = useState<'ts' | 'csv' | 'sql' | 'format'>('ts')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = (mode: 'ts' | 'csv' | 'sql' | 'format', source = inputJson) => {
    setActiveMode(mode)
    setError(null)
    if (!source.trim()) {
      setOutput('')
      return
    }

    try {
      if (mode === 'ts') {
        setOutput(jsonToTypeScript(source, 'UserData'))
      } else if (mode === 'csv') {
        setOutput(jsonToCsv(source))
      } else if (mode === 'sql') {
        setOutput(jsonToSql(source, 'usuarios'))
      } else if (mode === 'format') {
        setOutput(formatJson(source, 2))
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al parsear el JSON'
      setError(msg)
      setOutput('')
    }
  }

  // Auto-run on mount or mode change
  React.useEffect(() => {
    handleConvert(activeMode)
  }, [activeMode])

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadOutput = () => {
    if (!output) return
    const ext = activeMode === 'ts' ? 'ts' : activeMode === 'csv' ? 'csv' : activeMode === 'sql' ? 'sql' : 'json'
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `convertido.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Modes bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleConvert('ts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'ts'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON → TypeScript
          </button>
          <button
            onClick={() => handleConvert('csv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'csv'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON → CSV
          </button>
          <button
            onClick={() => handleConvert('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'sql'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON → SQL Insert
          </button>
          <button
            onClick={() => handleConvert('format')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'format'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Formatear / Minificar
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeMode === 'format' && (
            <button
              onClick={() => {
                try {
                  const min = minifyJson(inputJson)
                  setOutput(min)
                } catch {
                  setError('JSON no válido')
                }
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            >
              Minificar
            </button>
          )}
          <button
            onClick={() => {
              setInputJson(SAMPLE_JSON)
              handleConvert(activeMode, SAMPLE_JSON)
            }}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg hover:bg-indigo-950/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cargar Ejemplo
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/60 border-b border-slate-800">
            <span className="text-xs font-medium text-slate-400">JSON de Entrada</span>
            <button
              onClick={() => {
                setInputJson('')
                setOutput('')
              }}
              className="text-xs text-slate-500 hover:text-rose-400"
            >
              Limpiar
            </button>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value)
              handleConvert(activeMode, e.target.value)
            }}
            placeholder="Pega tu JSON aquí..."
            className="w-full h-[400px] p-3.5 bg-slate-950/30 text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/60 border-b border-slate-800">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Resultado ({activeMode.toUpperCase()})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
              <button
                onClick={handleDownloadOutput}
                disabled={!output}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 disabled:opacity-50"
              >
                <FileDown className="w-3.5 h-3.5" />
                Descargar
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="El resultado aparecerá aquí..."
            className="w-full h-[400px] p-3.5 bg-slate-950/50 text-indigo-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
