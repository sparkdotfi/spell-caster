import assert from 'node:assert'

export function getRequiredShellEnv(key: string): string {
  const value = process.env[key]
  assert(value, `Missing required environment variable: ${key}`)
  return value
}
