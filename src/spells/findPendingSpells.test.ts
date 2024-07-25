import { getFilenameWithoutExtension } from "./findPendingSpells"
import {describe, test, expect} from 'bun:test'

describe(getFilenameWithoutExtension.name, () => {
  test('gets filename without extension from a full path', () => {
    const fullPath = '/path/to/file.sol'
    const result = getFilenameWithoutExtension(fullPath)
    expect(result).toBe('file')
  })
})