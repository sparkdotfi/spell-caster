import { describe, expect, test } from 'bun:test'
import { CheckedAddress, Hex } from '@marsfoundation/common-universal'
import { mainnet } from 'viem/chains'
import { NetworkConfig } from '../config'
import { getMockEthereumClient } from '../test/MockEthereumClient'
import { executeSpell } from './executeSpell'

describe(executeSpell.name, () => {
  test('replaces the code of the executor with a code of a spell', async () => {
    const spellAddress = CheckedAddress.random('spell')
    const deployer = CheckedAddress.random('deployer')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: CheckedAddress.random('executor'),
    }
    const contracts = { [spellAddress]: Hex.random('spell-bytecode') }
    const ethereumClient = getMockEthereumClient(contracts)

    await executeSpell({ spellAddress, network, client: ethereumClient, deployer })

    expect(ethereumClient.setCode).toHaveBeenCalledWith(network.sparkSpellExecutor, contracts[spellAddress])
  })

  test('restores the code of the executor when done', async () => {
    const spellAddress = CheckedAddress.random('spell')
    const deployer = CheckedAddress.random('deployer')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: CheckedAddress.random('executor'),
    }
    const contracts = {
      [spellAddress]: Hex.random('spell-bytecode'),
      [network.sparkSpellExecutor]: Hex.random('executor-bytecode'),
    }
    const ethereumClient = getMockEthereumClient(contracts)

    await executeSpell({ spellAddress, network, client: ethereumClient, deployer })

    expect(await ethereumClient.getCode({ address: network.sparkSpellExecutor })).toBe(
      contracts[network.sparkSpellExecutor]!,
    )
  })

  test('executes a spell', async () => {
    const spellAddress = CheckedAddress.random('spell')
    const deployer = CheckedAddress.random('deployer')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: CheckedAddress.random('executor'),
    }
    const contracts = { [spellAddress]: Hex.random('spell-bytecode') }
    const ethereumClient = getMockEthereumClient(contracts)

    await executeSpell({ spellAddress, network, client: ethereumClient, deployer })
    ;(expect as any)(ethereumClient.assertWriteContract).toHaveBeenCalled({
      functionName: 'execute',
      to: spellAddress,
      abi: [
        {
          inputs: [],
          name: 'execute',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    })
  })

  test('throws if spell not deployed', async () => {
    const spellAddress = CheckedAddress.random('spell')
    const deployer = CheckedAddress.random('deployer')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: CheckedAddress.random('executor'),
    }
    const contracts = { [spellAddress]: undefined }
    const ethereumClient = getMockEthereumClient(contracts)

    expect(async () => await executeSpell({ spellAddress, network, client: ethereumClient, deployer })).toThrowError(
      'Spell not deployed',
    )
  })
})
