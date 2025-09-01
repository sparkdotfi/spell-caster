import core from '@actions/core'
import { assert } from '@sparkdotfi/common-universal'

export function getRequiredGithubInput(key: string, fallback?: string): string {
  const value = core.getInput(key)

  if (fallback) {
    return value || fallback
  }

  assert(value, `Missing required github input: ${key}`)

  return value
}
