import React, { useState, useEffect } from 'react'
import { KeyRound, Shield, Binary, Copy, Check, RefreshCw, Hash } from 'lucide-react'
import {
  calculateHash,
  toBase64,
  fromBase64,
  generateUuid,
  generatePassword,
} from '../../utils/crypto'

export const SecurityTools: React.FC = () => {
  const [activeSecTab, setActiveSecTab] = useState<'hash' | 'password' | 'base64'>('hash')

  // Hash state
  const [hashInput, setHashInput] = useState('Texto de ejemplo para hashear')
  const [sha256, setSha256] = useState('')
  const [sha512, setSha512] = useState('')
  const [sha1, setSha1] = useState('')

  // Password state
  const [pwLength, setPwLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNum, setIncludeNum] = useState(true)
  const [includeSym, setIncludeSym] = useState(true)
  const [generatedPw, setGeneratedPw] = useState('')
  const [entropy, setEntropy] = useState(0)
  const [uuid, setUuid] = useState('')

  // Base64 & URL state
  const [b64Input, setB64Input] = useState('Hola mundo en base64!')
  const [b64Output, setB64Output] = useState('')
  const [urlEncoded, setUrlEncoded] = useState('')

  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Update Hashes
  useEffect(() => {
    if (!hashInput) {
      setSha256('')
      setSha512('')
      setSha1('')
      return
    }
    calculateHash(hashInput, 'SHA-256').then(setSha256)
    calculateHash(hashInput, 'SHA-512').then(setSha512)
    calculateHash(hashInput, 'SHA-1').then(setSha1)
  }, [hashInput])

  // Update Password
  const regeneratePassword = () => {
    const res = generatePassword({
      length: pwLength,
      includeUppercase: includeUpper,
      includeLowercase: includeLower,
      includeNumbers: includeNum,
      includeSymbols: includeSym,
    })
    setGeneratedPw(res.password)
    setEntropy(res.entropyBits)
  }

  const regenerateUuid = () => {
    setUuid(generateUuid())
  }

  useEffect(() => {
    regeneratePassword()
    regenerateUuid()
  }, [pwLength, includeUpper, includeLower, includeNum, includeSym])

  // Update Base64 / URL
  useEffect(() => {
    try {
      setB64Output(toBase64(b64Input))
      setUrlEncoded(encodeURIComponent(b64Input))
    } catch {
      setB64Output('Error al codificar')
    }
  }, [b64Input])

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveSecTab('hash')}
          className={`flex items-center gap-2 pb-3 px-4 font-medium text-sm border-b-2 transition-all ${
            activeSecTab === 'hash'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Hash className="w-4 h-4" />
          Hashes Criptográficos
        </button>
        <button
          onClick={() => setActiveSecTab('password')}
          className={`flex items-center gap-2 pb-3 px-4 font-medium text-sm border-b-2 transition-all ${
            activeSecTab === 'password'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          Generador de Contraseñas & UUID
        </button>
        <button
          onClick={() => setActiveSecTab('base64')}
          className={`flex items-center gap-2 pb-3 px-4 font-medium text-sm border-b-2 transition-all ${
            activeSecTab === 'base64'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Binary className="w-4 h-4" />
          Base64 & URL Encode
        </button>
      </div>

      {/* HASH TAB */}
      {activeSecTab === 'hash' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Texto de entrada:
            </label>
            <textarea
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Escribe el texto a hashear..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-3">
            {[
              { label: 'SHA-256', val: sha256 },
              { label: 'SHA-512', val: sha512 },
              { label: 'SHA-1', val: sha1 },
            ].map(({ label, val }) => (
              <div key={label} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-400">{label}</span>
                  <button
                    onClick={() => copyToClipboard(val, label)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    {copiedKey === label ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedKey === label ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-300 break-all select-all">{val || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASSWORD & UUID TAB */}
      {activeSecTab === 'password' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Contraseña Segura
              </span>
              <button
                onClick={regeneratePassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Generar otra
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={generatedPw}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-3 pr-20 font-mono text-emerald-400 text-sm"
              />
              <button
                onClick={() => copyToClipboard(generatedPw, 'pw')}
                className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                {copiedKey === 'pw' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'pw' ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Longitud: {pwLength}</span>
                <span className="text-emerald-400 font-semibold">{entropy} bits de entropía</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={pwLength}
                onChange={(e) => setPwLength(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                Mayúsculas (A-Z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                Minúsculas (a-z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeNum}
                  onChange={(e) => setIncludeNum(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                Números (0-9)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeSym}
                  onChange={(e) => setIncludeSym(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                Símbolos (!@#$)
              </label>
            </div>
          </div>

          {/* UUID Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-200">UUID v4 Generator</span>
              <button
                onClick={regenerateUuid}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nuevo UUID
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={uuid}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-3 pr-20 font-mono text-cyan-400 text-sm"
              />
              <button
                onClick={() => copyToClipboard(uuid, 'uuid')}
                className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                {copiedKey === 'uuid' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'uuid' ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Genera identificadores únicos universales (UUID v4) basados en criptografía segura nativa del navegador (`crypto.randomUUID()`).
            </p>
          </div>
        </div>
      )}

      {/* BASE64 & URL TAB */}
      {activeSecTab === 'base64' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Texto original:
            </label>
            <textarea
              value={b64Input}
              onChange={(e) => setB64Input(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-400">Base64 Encode</span>
                <button
                  onClick={() => copyToClipboard(b64Output, 'b64')}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {copiedKey === 'b64' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'b64' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <textarea
                readOnly
                value={b64Output}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-lg p-2 font-mono text-xs text-slate-300 resize-none"
              />
              <button
                onClick={() => {
                  try {
                    const decoded = fromBase64(b64Input)
                    setB64Output(decoded)
                  } catch {
                    setB64Output('Base64 inválido para decodificar')
                  }
                }}
                className="text-xs text-slate-400 hover:text-indigo-400 font-medium"
              >
                Decodificar entrada como Base64 →
              </button>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400">URL Encode</span>
                <button
                  onClick={() => copyToClipboard(urlEncoded, 'url')}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'url' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <textarea
                readOnly
                value={urlEncoded}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-lg p-2 font-mono text-xs text-slate-300 resize-none"
              />
              <button
                onClick={() => {
                  try {
                    setUrlEncoded(decodeURIComponent(b64Input))
                  } catch {
                    setUrlEncoded('URL inválida para decodificar')
                  }
                }}
                className="text-xs text-slate-400 hover:text-cyan-400 font-medium"
              >
                Decodificar entrada como URL →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
