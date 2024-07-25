import * as path from 'node:path'

export function ensureAbsolutePath(p: string): string {
  return path.resolve(p)
}
