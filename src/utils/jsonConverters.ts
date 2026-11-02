export function jsonToTypeScript(jsonStr: string, rootName = 'RootObject'): string {
  try {
    const parsed = JSON.parse(jsonStr)

    function getType(val: unknown): string {
      if (val === null) return 'null'
      if (val === undefined) return 'undefined'
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]'
        const elemType = getType(val[0])
        return `${elemType}[]`
      }
      if (typeof val === 'object') {
        const entries = Object.entries(val as Record<string, unknown>)
        if (entries.length === 0) return 'Record<string, any>'
        const lines = entries.map(([k, v]) => `  ${k}: ${getType(v)};`)
        return `{\n${lines.join('\n')}\n}`
      }
      return typeof val
    }

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null) {
        const itemType = jsonToTypeScript(JSON.stringify(parsed[0]), `${rootName}Item`)
        return `${itemType}\n\nexport type ${rootName} = ${rootName}Item[];`
      }
      return `export type ${rootName} = ${getType(parsed)};`
    }

    if (typeof parsed === 'object' && parsed !== null) {
      const lines: string[] = []
      const nestedInterfaces: string[] = []

      for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          const capitalized = key.charAt(0).toUpperCase() + key.slice(1)
          nestedInterfaces.push(jsonToTypeScript(JSON.stringify(val), capitalized))
          lines.push(`  ${key}: ${capitalized};`)
        } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null) {
          const capitalized = key.charAt(0).toUpperCase() + key.slice(1) + 'Item'
          nestedInterfaces.push(jsonToTypeScript(JSON.stringify(val[0]), capitalized))
          lines.push(`  ${key}: ${capitalized}[];`)
        } else {
          lines.push(`  ${key}: ${getType(val)};`)
        }
      }

      const currentInterface = `export interface ${rootName} {\n${lines.join('\n')}\n}`
      return [...nestedInterfaces, currentInterface].join('\n\n')
    }

    return `export type ${rootName} = ${typeof parsed};`
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`JSON no válido: ${msg}`)
  }
}

export function jsonToCsv(jsonStr: string): string {
  const parsed = JSON.parse(jsonStr)
  const items: Record<string, unknown>[] = Array.isArray(parsed) ? parsed : [parsed]

  if (items.length === 0) return ''

  const headers = Array.from(
    new Set(items.flatMap((item) => (typeof item === 'object' && item !== null ? Object.keys(item) : [])))
  )

  const rows = items.map((item) => {
    return headers
      .map((header) => {
        const val = item ? item[header] : ''
        if (val === null || val === undefined) return '""'
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
        return `"${str.replace(/"/g, '""')}"`
      })
      .join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

export function jsonToSql(jsonStr: string, tableName = 'my_table'): string {
  const parsed = JSON.parse(jsonStr)
  const items: Record<string, unknown>[] = Array.isArray(parsed) ? parsed : [parsed]

  if (items.length === 0) return '-- No data found'

  const headers = Array.from(
    new Set(items.flatMap((item) => (typeof item === 'object' && item !== null ? Object.keys(item) : [])))
  )

  const statements = items.map((item) => {
    const values = headers.map((h) => {
      const val = item ? item[h] : null
      if (val === null || val === undefined) return 'NULL'
      if (typeof val === 'number' || typeof val === 'boolean') return `${val}`
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
      return `'${str.replace(/'/g, "''")}'`
    })
    return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});`
  })

  return statements.join('\n')
}

export function formatJson(jsonStr: string, space = 2): string {
  const parsed = JSON.parse(jsonStr)
  return JSON.stringify(parsed, null, space)
}

export function minifyJson(jsonStr: string): string {
  const parsed = JSON.parse(jsonStr)
  return JSON.stringify(parsed)
}
