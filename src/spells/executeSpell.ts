import assert from 'node:assert'
import { TestnetClient } from '@marsfoundation/common-testnets'
import { type Address } from 'viem'
import { NetworkConfig } from '../config'

interface ExecuteSpellArgs {
  spellAddress: Address
  network: NetworkConfig
  client: TestnetClient
  deployer: Address
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
    to: network.sparkSpellExecutor,
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
