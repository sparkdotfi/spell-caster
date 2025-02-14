import { spyOn } from 'bun:test'
import { TestnetClient } from '@marsfoundation/common-testnets'
import { type Address, type Hex } from 'viem'

export function getMockEthereumClient(contracts: ContractsMap = {}): TestnetClient {
  const ethereumClient = new MockTestnetClient({ ...contracts }) // @note: deep copy to avoid mutation

  // @todo: automate by spying every function on the prototype
  spyOn(ethereumClient, 'getCode')
  spyOn(ethereumClient, 'setCode')
  spyOn(ethereumClient, 'assertWriteContract')

  return ethereumClient as any
}

type ContractsMap = Record<Address, Hex | undefined>

class MockTestnetClient implements Partial<TestnetClient> {
  constructor(public readonly contracts = {} as ContractsMap) {}

  async setCode(address: Address, bytecode: Hex): Promise<void> {
    this.contracts[address] = bytecode
  }

  async getCode(args: { address: Address }): Promise<Hex | undefined> {
    return this.contracts[args.address]
  }

  async assertWriteContract(): Promise<Hex> {
    return '0x1234'
  }
}
