import { zeroAddress, type Address } from 'viem'
import { gnosis, mainnet } from 'viem/chains'

export interface Config {
  tenderly: TenderlyConfig
  networks: Record<string, NetworkConfig>
  deployer: Address
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

export function getConfig(getEnvVariable: (key: string) => string): Config {
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
    },
    deployer: zeroAddress,
  }
}
