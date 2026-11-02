# 🛡️ PrivacyToolbox

> **100% Client-Side Privacy Utilities for Developers & Users.**  
> *Tus archivos y datos nunca salen de tu navegador. Sin servidores, sin analíticas, sin rastreo.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Privacy: Guaranteed](https://img.shields.io/badge/Privacy-100%25%20Local-emerald.svg)](#garantía-de-privacidad)

---

## ⚡ ¿Por qué PrivacyToolbox?

Muchas herramientas en línea gratuitas para convertir archivos, comprimir imágenes o formatear JSON envían tus datos privados o documentos confidenciales a servidores remotos. 

**PrivacyToolbox** resuelve esto ejecutando todas las operaciones **100% en el cliente** mediante APIs nativas del navegador (HTML5 Canvas, Web Crypto API y WebAssembly/JavaScript).

---

## 🛠️ Herramientas Incluidas

### 📑 1. Utilidades PDF
- **Unir PDFs (Merge):** Combina múltiples archivos PDF en un solo documento con orden personalizado mediante drag & drop.
- **Dividir / Extraer Páginas (Split):** Extrae rangos específicos de páginas (ej. `1-3, 5, 8-10`) a un nuevo PDF sin pérdida de calidad.
- *Potenciado por `pdf-lib` directamente en memoria.*

### 🖼️ 2. Compresor & Conversor de Imágenes
- Compresión y redimensionado de imágenes en tiempo real.
- Control milimétrico de calidad (10% - 100%) y resolución máxima (4K, Full HD, HD, etc.).
- Conversión instantánea entre formatos modernos (**WebP**, **JPEG**, **PNG**).
- Comparativa visual y de peso en tiempo real (muestra el porcentaje de ahorro exacto).

### 💻 3. Utilidades para Desarrolladores
- **JSON → TypeScript:** Convierte cualquier JSON complejo o anidado en interfaces de TypeScript listas para usar.
- **JSON → CSV:** Extrae registros tabulares y genera archivos `.csv` descargables.
- **JSON → SQL:** Genera consultas `INSERT INTO tabla (...) VALUES (...)` automáticamente.
- **Formateador & Minificador:** Validador de sintaxis con resaltado de errores y ajuste de indentación.

### 🔐 4. Seguridad & Criptografía
- **Hashes Criptográficos:** Cálculo instantáneo de sumas de verificación **SHA-256**, **SHA-512** y **SHA-1** usando la `Web Crypto API` (`crypto.subtle`).
- **Generador de Contraseñas Seguras:** Ajuste de longitud, mayúsculas, minúsculas, números y símbolos con medidor de entropía en bits.
- **Generador de UUID v4:** Generación de identificadores universales únicos mediante `crypto.randomUUID()`.
- **Base64 & URL Encoder/Decoder:** Conversión bidireccional segura compatible con caracteres UTF-8.

### 📝 5. Inspector de Texto & Case Converter
- Contador en vivo de palabras, caracteres totales, caracteres sin espacios y líneas.
- Estimador de tiempo de lectura y tiempo de oratoria/discurso.
- Conversor de estilo en 1 clic: `UPPERCASE`, `lowercase`, `Title Case`, `camelCase`, `PascalCase`, `snake_case`, `kebab-case`, `CONSTANT_CASE`.

### 🔍 6. Regex Tester
- Probador en vivo de expresiones regulares con soporte para flags (`g`, `i`, `m`).
- Resaltado de coincidencias y desglose de grupos e índices.

---

## 🚀 Inicio Rápido en Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/privacy-toolbox.git

# 2. Entrar al directorio
cd privacy-toolbox

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📦 Construcción para Producción

```bash
npm run build
```

El build estático optimizado se generará en la carpeta `dist/`.

---

## 🌐 Despliegue en 1 Clic (Gratis)

Al ser una aplicación 100% estática (Single Page Application), puedes alojarla de forma gratuita en:

- **GitHub Pages:** Conecta la rama `gh-pages` o configura la GitHub Action de Vite.
- **Vercel / Netlify:** Importa tu repositorio desde el panel de control y se desplegará automáticamente.

---

## 🔒 Garantía de Privacidad

- **Cero telemetría:** No se registran eventos ni analíticas de uso.
- **Cero llamadas de red salientes:** Ningún archivo procesado es transmitido a ninguna API externa.
- **Funciona Offline:** Una vez cargada la aplicación, puedes apagar tu conexión a Internet y seguirá funcionando con total normalidad.

---

## 📄 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.
