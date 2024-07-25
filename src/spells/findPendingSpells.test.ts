import { describe, expect, test } from 'bun:test'
import { getFilenameWithoutExtension } from './findPendingSpells'

describe(getFilenameWithoutExtension.name, () => {
  test('gets filename without extension from a full path', () => {
    const fullPath = '/path/to/file.sol'
    const result = getFilenameWithoutExtension(fullPath)
    expect(result).toBe('file')
  })
})
