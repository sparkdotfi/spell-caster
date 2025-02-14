import { type Address, zeroAddress } from 'viem'
import { arbitrum, base, gnosis, mainnet } from 'viem/chains'

export interface Config {
  tenderly: TenderlyConfig
  networks: Record<string, NetworkConfig>
  deployer: Address
  spellsRepoPath: string
}

export interface NetworkConfig {
  name: string
  chainId: number
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
        chainId: mainnet.id,
        sparkSpellExecutor: '0x3300f198988e4C9C63F75dF86De36421f06af8c4',
      },
      [gnosis.id]: {
        name: 'gnosis',
        chainId: gnosis.id,
        sparkSpellExecutor: '0xc4218C1127cB24a0D6c1e7D25dc34e10f2625f5A',
      },
      [base.id]: {
        name: 'base',
        chainId: base.id,
        sparkSpellExecutor: '0xF93B7122450A50AF3e5A76E1d546e95Ac1d0F579',
      },
      [arbitrum.id]: {
        name: 'arbitrum',
        chainId: arbitrum.id,
        sparkSpellExecutor: '0x65d946e533748A998B1f0E430803e39A6388f7a1',
      },
    },
    deployer: zeroAddress,
    spellsRepoPath,
  }
}
