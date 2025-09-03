import core from '@actions/core'
import { assert } from '@sparkdotfi/common-universal'
import { IEnv } from './IEnv'

export class ActionEnv implements IEnv {
  string(key: string, fallback?: string): string {
    const value = core.getInput(key)

    if (fallback) {
      return value || fallback
    }

    assert(value, `Missing required github input: ${key}`)

    return value
  }
  optionalString(key: string): string | undefined {
    const value = core.getInput(key)

    return value || undefined
  }
}
