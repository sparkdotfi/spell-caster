import assert from 'node:assert'
import { TestnetClient } from '@sparkdotfi/common-testnets'
import { CheckedAddress } from '@sparkdotfi/common-universal'
import { NetworkConfig } from '../config'

interface ExecuteSpellArgs {
  spellAddress: CheckedAddress
  network: NetworkConfig
  client: TestnetClient
  deployer: CheckedAddress
}

export async function executeSpell({ spellAddress, network, client, deployer }: ExecuteSpellArgs): Promise<void> {
  const originalSpellExecutorBytecode = await client.getCode({
    address: network.sparkSpellExecutor,
  })

  const spellBytecode = await client.getCode({
    address: spellAddress,
  })
  assert(spellBytecode, `Spell not deployed (address=${spellAddress})`)
  await client.setCode(network.sparkSpellExecutor, spellBytecode)

  await client.assertWriteContract({
    address: network.sparkSpellExecutor,
    abi: [
      {
        inputs: [],
        name: 'execute',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'execute',
    account: deployer,
  })

  await client.setCode(network.sparkSpellExecutor, originalSpellExecutorBytecode!)
}
