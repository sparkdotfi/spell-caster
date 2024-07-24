import assert from 'node:assert'
import core from '@actions/core'
import { getConfig } from '../config'
import { executeSpell } from '../executeSpell'
import { EthereumClient } from '../periphery/ethereum'
import { buildAppUrl } from '../periphery/spark-app'
import { createTenderlyVNet, getRandomChainId } from '../periphery/tenderly'
import { deployContract } from '../utils/forge'
import { getChainIdFromSpellName } from '../utils/getChainIdFromSpellName'
import { getRequiredShellEnv } from '../config/environments/cli'
import { getRequiredGithubInput } from '../config/environments/action'

async function main() {
  core.info('Hello, World!')
  // assert(spellName, 'Pass spell name as an argument ex. SparkEthereum_20240627')

  // const config = getConfig(getRequiredGithubInput)
  // const originChainId = getChainIdFromSpellName(spellName)
  // const chain = config.networks[originChainId]
  // assert(chain, `Chain not found for chainId: ${originChainId}`)
  // const forkChainId = getRandomChainId()

  // console.log(`Executing spell ${spellName} on ${chain.name} (chainId=${originChainId})`)

  // const rpc = await createTenderlyVNet({
  //   account: config.tenderly.account,
  //   apiKey: config.tenderly.apiKey,
  //   project: config.tenderly.project,
  //   originChainId: originChainId,
  //   forkChainId,
  // })
  // const ethereumClient = new EthereumClient(rpc, forkChainId, deployer)

  // const spellAddress = await deployContract(spellName, rpc, deployer)

  // await executeSpell({ spellAddress, network: chain, ethereumClient })

  // core.info(`Fork Network RPC: ${rpc}`)
  // core.info(`Spark App URL: ${buildAppUrl({ rpc, originChainId })}`)
}

await main()