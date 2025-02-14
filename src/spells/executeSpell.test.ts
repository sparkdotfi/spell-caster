import { describe, expect, test } from 'bun:test'
import { mainnet } from 'viem/chains'
import { NetworkConfig } from '../config'
import { getMockEthereumClient } from '../test/MockEthereumClient'
import { randomAddress } from '../test/addressUtils'
import { asciiToHex, hexStringToHex } from '../test/hexUtils'
import { executeSpell } from './executeSpell'

describe(executeSpell.name, () => {
  test('replaces the code of the executor with a code of a spell', async () => {
    const spellAddress = randomAddress('spell')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: randomAddress('executor'),
    }
    const contracts = { [spellAddress]: hexStringToHex(asciiToHex('spell-bytecode')) }
    const ethereumClient = getMockEthereumClient(contracts)

    await executeSpell({ spellAddress, network, client: ethereumClient })

    expect(ethereumClient.setCode).toHaveBeenCalledWith(network.sparkSpellExecutor, contracts[spellAddress])
  })

  test('restores the code of the executor when done', async () => {
    const spellAddress = randomAddress('spell')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: randomAddress('executor'),
    }
    const contracts = {
      [spellAddress]: hexStringToHex(asciiToHex('spell-bytecode')),
      [network.sparkSpellExecutor]: hexStringToHex(asciiToHex('executor-bytecode')),
    }
    const ethereumClient = getMockEthereumClient(contracts)

    await executeSpell({ spellAddress, network, client: ethereumClient })

    expect(await ethereumClient.getCode({ address: network.sparkSpellExecutor })).toBe(
      contracts[network.sparkSpellExecutor]!,
    )
  })

  test('executes a spell', async () => {
    const spellAddress = randomAddress('spell')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: randomAddress('executor'),
    }
    const contracts = { [spellAddress]: hexStringToHex(asciiToHex('spell-bytecode')) }
    const ethereumClient = getMockEthereumClient(contracts)

    await executeSpell({ spellAddress, network, client: ethereumClient })
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
    const spellAddress = randomAddress('spell')
    const network: NetworkConfig = {
      name: 'mainnet',
      chain: mainnet,
      sparkSpellExecutor: randomAddress('executor'),
    }
    const contracts = { [spellAddress]: undefined }
    const ethereumClient = getMockEthereumClient(contracts)

    expect(async () => await executeSpell({ spellAddress, network, client: ethereumClient })).toThrowError(
      'Spell not deployed',
    )
  })
})
