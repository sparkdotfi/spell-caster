import assert from 'node:assert'
import { forkAndExecuteSpell } from '..'
import { getConfig } from '../config'
import { getRequiredShellEnv } from '../config/environments/cli'

async function main(spellName?: string) {
  assert(spellName, 'Pass spell name as an argument ex. SparkEthereum_20240627')

  const config = getConfig(getRequiredShellEnv)

  console.log(`Executing spell ${spellName}`)
  const { forkRpc, appUrl } = await forkAndExecuteSpell(spellName, config)

  console.log(`Fork Network RPC: ${forkRpc}`)
  console.log(`Spark App URL: ${appUrl}`)
}

const arg1 = process.argv[2]
await main(arg1)
