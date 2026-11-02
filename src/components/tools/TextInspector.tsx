import React, { useState } from 'react'
import { Copy, Check, Clock, AlignLeft, BookOpen } from 'lucide-react'
import { analyzeText, convertCase } from '../../utils/text'

export const TextInspector: React.FC = () => {
  const [text, setText] = useState<string>(
    'El software libre y las herramientas locales protegen la privacidad de los desarrolladores y usuarios.'
  )
  const [copied, setCopied] = useState(false)

  const stats = analyzeText(text)

  const applyCase = (caseType: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'pascal' | 'constant') => {
    setText(convertCase(text, caseType))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Palabras</span>
          <span className="text-xl font-bold text-slate-100">{stats.words}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Caracteres</span>
          <span className="text-xl font-bold text-slate-100">{stats.characters}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Sin espacios</span>
          <span className="text-xl font-bold text-indigo-400">{stats.charactersNoSpaces}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Líneas</span>
          <span className="text-xl font-bold text-slate-100">{stats.lines}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-cyan-400" /> Lectura
          </span>
          <span className="text-base font-bold text-cyan-400 mt-1 block">~{stats.readingTimeMinutes} min</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" /> Discurso
          </span>
          <span className="text-base font-bold text-emerald-400 mt-1 block">~{stats.speakingTimeMinutes} min</span>
        </div>
      </div>

      {/* Case Converters Row */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-indigo-400" />
            Conversores de Estilo (Case)
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? '¡Copiado!' : 'Copiar texto'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyCase('upper')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
          >
            MAYÚSCULAS
          </button>
          <button
            onClick={() => applyCase('lower')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
          >
            minúsculas
          </button>
          <button
            onClick={() => applyCase('title')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
          >
            Título (Title Case)
          </button>
          <button
            onClick={() => applyCase('camel')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300"
          >
            camelCase
          </button>
          <button
            onClick={() => applyCase('pascal')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300"
          >
            PascalCase
          </button>
          <button
            onClick={() => applyCase('snake')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300"
          >
            snake_case
          </button>
          <button
            onClick={() => applyCase('kebab')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300"
          >
            kebab-case
          </button>
          <button
            onClick={() => applyCase('constant')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300"
          >
            CONSTANT_CASE
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe o pega aquí tu texto..."
          rows={10}
          className="w-full p-4 bg-slate-950 text-slate-200 text-sm leading-relaxed focus:outline-none resize-y"
        />
      </div>
    </div>
  )
}
