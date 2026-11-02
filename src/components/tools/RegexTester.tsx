import React, { useState, useMemo } from 'react'
import { Search, AlertCircle, CheckCircle } from 'lucide-react'

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})')
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean }>({
    g: true,
    i: true,
    m: false,
  })
  const [testText, setTestText] = useState<string>(
    'Contáctanos a soporte@privacytoolbox.dev o envía un correo a contacto@ejemplo.com para más información.'
  )

  const activeFlags = useMemo(() => {
    let f = ''
    if (flags.g) f += 'g'
    if (flags.i) f += 'i'
    if (flags.m) f += 'm'
    return f
  }, [flags])

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null }
    try {
      const regex = new RegExp(pattern, activeFlags)
      const found: RegExpExecArray[] = []

      if (flags.g) {
        let match: RegExpExecArray | null
        let count = 0
        while ((match = regex.exec(testText)) !== null && count < 100) {
          found.push(match)
          count++
          if (match.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        const match = regex.exec(testText)
        if (match) found.push(match)
      }

      return { matches: found, error: null }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Expresión regular no válida'
      return { matches: [], error: msg }
    }
  }, [pattern, activeFlags, testText, flags.g])

  return (
    <div className="space-y-5">
      {/* Pattern Input & Flags */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Expresión Regular (Regex)
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-sm">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="ej: [a-z0-9]+"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-6 pr-6 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 font-mono text-sm">/</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            {(['g', 'i', 'm'] as const).map((flag) => (
              <button
                key={flag}
                onClick={() => setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))}
                className={`w-7 h-7 font-mono font-bold rounded-lg transition-all ${
                  flags[flag]
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={`Flag ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Test String & Match Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Texto de Prueba
          </label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={8}
            placeholder="Escribe el texto donde deseas probar tu regex..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono resize-none leading-relaxed"
          />
        </div>

        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" /> Coincidencias
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {matches.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-2 max-h-[220px]">
            {matches.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No se encontraron coincidencias</p>
            ) : (
              matches.map((m, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-cyan-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> Match #{idx + 1}
                    </span>
                    <span>idx: {m.index}</span>
                  </div>
                  <div className="font-mono text-slate-200 break-all bg-slate-900/60 p-1.5 rounded">
                    {m[0]}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
