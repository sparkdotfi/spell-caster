import assert from 'node:assert'
import core from '@actions/core'

export function getRequiredGithubInput(key: string): string {
  const value = core.getInput(key)
  assert(value, `Missing required github input: ${key}`)
  return value
}
