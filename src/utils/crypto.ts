export async function calculateHash(
  text: string,
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return btoa(binString)
}

export function fromBase64(base64Str: string): string {
  const binString = atob(base64Str)
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function generateUuid(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export function generatePassword(options: PasswordOptions): { password: string; entropyBits: number } {
  let charset = ''
  if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (options.includeNumbers) charset += '0123456789'
  if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (charset.length === 0) {
    charset = 'abcdefghijklmnopqrstuvwxyz'
  }

  const array = new Uint32Array(options.length)
  crypto.getRandomValues(array)

  let password = ''
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length]
  }

  const entropyBits = Math.round(options.length * Math.log2(charset.length))
  return { password, entropyBits }
}
