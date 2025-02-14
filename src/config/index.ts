import { CheckedAddress } from '@marsfoundation/common-universal'
import { type Address, Chain } from 'viem'
import { arbitrum, base, gnosis, mainnet } from 'viem/chains'

export interface Config {
  tenderly: TenderlyConfig
  networks: Record<string, NetworkConfig>
  deployer: CheckedAddress
  spellsRepoPath: string
}

export interface NetworkConfig {
  name: string
  chain: Chain
  sparkSpellExecutor: Address
}

export interface TenderlyConfig {
  account: string
  project: string
  apiKey: string
}

export function getConfig(getEnvVariable: (key: string) => string, spellsRepoPath: string): Config {
  return {
    tenderly: {
      account: getEnvVariable('TENDERLY_ACCOUNT'),
      project: getEnvVariable('TENDERLY_PROJECT'),
      apiKey: getEnvVariable('TENDERLY_API_KEY'),
    },
    networks: {
      [mainnet.id]: {
        name: 'mainnet',
        chain: mainnet,
        sparkSpellExecutor: '0x3300f198988e4C9C63F75dF86De36421f06af8c4',
      },
      [gnosis.id]: {
        name: 'gnosis',
        chain: gnosis,
        sparkSpellExecutor: '0xc4218C1127cB24a0D6c1e7D25dc34e10f2625f5A',
      },
      [base.id]: {
        name: 'base',
        chain: base,
        sparkSpellExecutor: '0xF93B7122450A50AF3e5A76E1d546e95Ac1d0F579',
      },
      [arbitrum.id]: {
        name: 'arbitrum',
        chain: arbitrum,
        sparkSpellExecutor: '0x65d946e533748A998B1f0E430803e39A6388f7a1',
      },
    },
    deployer: CheckedAddress.ZERO(),
    spellsRepoPath,
  }
}
