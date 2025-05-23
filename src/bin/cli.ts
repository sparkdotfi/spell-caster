import assert from 'node:assert'
import { parseArgs } from 'node:util'
import { forkAndExecuteSpell } from '..'
import { getConfig } from '../config'
import { getRequiredShellEnv } from '../config/environments/cli'
import { ensureAbsolutePath } from '../utils/fs'

async function main() {
  const args = parseArgs({
    options: {
      root: {
        type: 'string',
      },
    },
    allowPositionals: true,
    strict: true,
  })
  const rootPath = args.values.root
  const spellName = args.positionals[0]

  assert(spellName, 'Pass spell name as an argument ex. SparkEthereum_20240627')
  assert(rootPath, 'Pass root path as an argument ex. --root /path/to/spark-spells')

  const config = getConfig(getRequiredShellEnv, ensureAbsolutePath(rootPath))

  console.log(`Executing spell ${spellName}`)
  const { forkRpc, appUrl } = await forkAndExecuteSpell(spellName, config)

  console.log(`Fork Network RPC: ${forkRpc}`)
  console.log(`Spark App URL: ${appUrl}`)
}

await main()
