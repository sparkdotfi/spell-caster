import assert from 'node:assert'
import { TenderlyTestnetFactory, getRandomChainId } from '@sparkdotfi/common-testnets'
import { HttpClient } from '@sparkdotfi/common-universal/http-client'
import { Logger } from '@sparkdotfi/common-universal/logger'
import { Config } from './config'
import { deployContract } from './periphery/forge'
import { buildAppUrl } from './periphery/spark-app'
// import { executeSpell } from './spells/executeSpell'
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
  const chainConfig = config.networks[originChainId]
  assert(chainConfig, `Chain not found for chainId: ${originChainId}`)

  const tenderlyFactory = new TenderlyTestnetFactory(
    {
      account: config.tenderly.account,
      apiKey: config.tenderly.apiKey,
      project: config.tenderly.project,
    },
    new HttpClient({}, Logger.SILENT),
  )
  const forkChainId = getRandomChainId()
  const result = await tenderlyFactory.create({
    id: `spell-caster-${chainConfig.chain.id}`,
    origin: chainConfig.name,
    forkChainId,
  })
  assert(result.publicRpcUrl)

  await deployContract({
    contractName: spellName,
    rpc: result.rpcUrl,
    from: config.deployer,
    cwd: config.spellsRepoPath,
  })

  // await executeSpell({ spellAddress, network: chainConfig, client: result.client, deployer: config.deployer })

  await result.cleanup()

  return {
    spellName,
    originChainId,
    forkRpc: result.publicRpcUrl,
    forkChainId,
    appUrl: buildAppUrl({ rpc: result.publicRpcUrl, originChainId }),
  }
}
