import { spyOn } from 'bun:test'
import { TestnetClient } from '@sparkdotfi/common-testnets'
import { Hash } from '@sparkdotfi/common-universal'
import { type Address, type Hex, WaitForTransactionReceiptReturnType } from 'viem'

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

  async assertWriteContract(): Promise<WaitForTransactionReceiptReturnType> {
    return { transactionHash: Hash.random() } as any
  }
}
