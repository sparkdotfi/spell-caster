import { getEnv } from '@sparkdotfi/common-nodejs/env'

const env = getEnv()

export const getRequiredShellEnv = env.string
