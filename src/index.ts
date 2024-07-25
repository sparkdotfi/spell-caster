import assert from 'node:assert'
import { Config } from './config'
import { EthereumClient } from './periphery/ethereum'
import { deployContract } from './periphery/forge'
import { buildAppUrl } from './periphery/spark-app'
import { createTenderlyVNet, getRandomChainId } from './periphery/tenderly'
import { executeSpell } from './spells/executeSpell'
import { getChainIdFromSpellName } from './utils/getChainIdFromSpellName'

export interface ForkAndExecuteSpellReturn {
  spellName: string
  originChainId: number
  forkRpc: string
  forkChainId: number
  appUrl: string
}

export async function forkAndExecuteSpell(spellName: string, config: Config): Promise<ForkAndExecuteSpellReturn> {
  const originChainId = getChainIdFromSpellName(spellName)
  const chain = config.networks[originChainId]
  assert(chain, `Chain not found for chainId: ${originChainId}`)
  const forkChainId = getRandomChainId()

  const rpc = await createTenderlyVNet({
    account: config.tenderly.account,
    apiKey: config.tenderly.apiKey,
    project: config.tenderly.project,
    originChainId: originChainId,
    forkChainId,
  })
  const ethereumClient = new EthereumClient(rpc.adminRpcUrl, forkChainId, config.deployer)

  const spellAddress = await deployContract(spellName, rpc.adminRpcUrl, config.deployer)

  await executeSpell({ spellAddress, network: chain, ethereumClient })

  return {
    spellName,
    originChainId,
    forkRpc: rpc.publicRpcUrl,
    forkChainId,
    appUrl: buildAppUrl({ rpc: rpc.publicRpcUrl, originChainId }),
  }
}
