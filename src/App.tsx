import { useState, useMemo } from 'react'
import { Navbar, type TabType } from './components/Navbar'
import { PdfMergeSplit } from './components/tools/PdfMergeSplit'
import { ImageCompressor } from './components/tools/ImageCompressor'
import { JsonConverter } from './components/tools/JsonConverter'
import { SecurityTools } from './components/tools/SecurityTools'
import { TextInspector } from './components/tools/TextInspector'
import { RegexTester } from './components/tools/RegexTester'
import { ShieldCheck, Heart, Sparkles, FileText, Image, Code2, Lock, Type, Search } from 'lucide-react'

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pdf')
  const [searchQuery, setSearchQuery] = useState('')

  const toolsMeta = useMemo(
    () => [
      { id: 'pdf' as TabType, title: 'PDF Tools', desc: 'Unir PDFs y extraer páginas', icon: FileText, keywords: 'pdf unir merge split extraer paginas' },
      { id: 'image' as TabType, title: 'Compresor de Imágenes', desc: 'Comprimir, cambiar tamaño y convertir PNG/JPG/WebP', icon: Image, keywords: 'imagen comprimir redimensionar webp png jpg' },
      { id: 'dev' as TabType, title: 'Dev & JSON Converter', desc: 'JSON a TypeScript, CSV, SQL insert y formateador', icon: Code2, keywords: 'json typescript csv sql format dev beautify' },
      { id: 'security' as TabType, title: 'Seguridad & Hashes', desc: 'SHA-256, contraseñas seguras, UUID v4 y Base64', icon: Lock, keywords: 'hash sha256 sha512 password contrasena uuid base64 security' },
      { id: 'text' as TabType, title: 'Inspector de Texto & Case', desc: 'Contador de palabras, tiempo de lectura y cambio de estilo', icon: Type, keywords: 'texto palabras caracteres case camelcase snake uppercase' },
      { id: 'regex' as TabType, title: 'Regex Tester', desc: 'Probador de expresiones regulares en tiempo real', icon: Search, keywords: 'regex expresion regular tester matcher' },
    ],
    []
  )

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return toolsMeta.filter((t) => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.keywords.includes(q))
  }, [searchQuery, toolsMeta])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Results Dropdown / Quick Links if searching */}
        {searchQuery.trim() !== '' && (
          <div className="p-4 bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-2">
            <span className="text-xs font-semibold uppercase text-indigo-400">
              Resultados de búsqueda ({filteredTools.length}):
            </span>
            {filteredTools.length === 0 ? (
              <p className="text-sm text-slate-400">No encontramos herramientas para "{searchQuery}"</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredTools.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTab(t.id)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-left transition-all"
                    >
                      <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{t.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{t.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-950 border border-slate-800 p-6 sm:p-8">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Herramientas de Privacidad Total
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Tus archivos y datos nunca salen de tu dispositivo.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Convierte documentos, comprime imágenes, prueba expresiones regulares y manipula datos con la seguridad de que nada se sube a la nube. Rápido, gratuito y de código abierto.
            </p>
          </div>

          <div className="absolute right-6 -bottom-10 opacity-10 pointer-events-none hidden md:block">
            <ShieldCheck className="w-64 h-64 text-indigo-400" />
          </div>
        </div>

        {/* Active Tool Container */}
        <div className="bg-slate-900/50 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xs">
          {activeTab === 'pdf' && <PdfMergeSplit />}
          {activeTab === 'image' && <ImageCompressor />}
          {activeTab === 'dev' && <JsonConverter />}
          {activeTab === 'security' && <SecurityTools />}
          {activeTab === 'text' && <TextInspector />}
          {activeTab === 'regex' && <RegexTester />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Creado con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para la comunidad de código abierto</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-medium">100% Client-Side • Sin Rastreo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
