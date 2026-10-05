import { describe, expect, test } from 'bun:test'
import { isSupportedByTenderly } from './isSupportedByTenderly'

describe(isSupportedByTenderly.name, () => {
  test('returns true for spells on chains supported by tenderly', () => {
    expect(isSupportedByTenderly('SparkEthereum_20261008')).toBe(true)
    expect(isSupportedByTenderly('SparkArbitrumOne_20261008')).toBe(true)
  })

  test('returns false for xlayer spells', () => {
    expect(isSupportedByTenderly('SparkXLayer_20261008')).toBe(false)
  })
})
