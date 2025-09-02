import { CheckedAddress, SparkDomain } from '@sparkdotfi/common-universal'
import { Chain } from 'viem'
import { arbitrum, base, gnosis, mainnet, optimism, unichain } from 'viem/chains'
import { IEnv } from './environment/IEnv'

export interface Config {
  tenderly: TenderlyConfig
  slackWebhookUrl: string | undefined
  githubToken: string
  networks: Record<string, NetworkConfig>
  deployer: CheckedAddress
  spellsRepoPath: string
}

export interface NetworkConfig {
  name: SparkDomain
  chain: Chain
  sparkSpellExecutor: CheckedAddress
}

export interface TenderlyConfig {
  account: string
  project: string
  apiKey: string
}

export function getConfig(env: IEnv, spellsRepoPath: string): Config {
  return {
    tenderly: {
      account: env.string('TENDERLY_ACCOUNT'),
      project: env.string('TENDERLY_PROJECT'),
      apiKey: env.string('TENDERLY_API_KEY'),
    },

    slackWebhookUrl: env.optionalString('SLACK_WEBHOOK_URL'),
    githubToken: env.string('github-token'),

    networks: {
      [mainnet.id]: {
        name: 'mainnet',
        chain: mainnet,
        sparkSpellExecutor: CheckedAddress('0x3300f198988e4C9C63F75dF86De36421f06af8c4'),
      },
      [gnosis.id]: {
        name: 'gnosis',
        chain: gnosis,
        sparkSpellExecutor: CheckedAddress('0xc4218C1127cB24a0D6c1e7D25dc34e10f2625f5A'),
      },
      [base.id]: {
        name: 'base',
        chain: base,
        sparkSpellExecutor: CheckedAddress('0xF93B7122450A50AF3e5A76E1d546e95Ac1d0F579'),
      },
      [arbitrum.id]: {
        name: 'arbitrum',
        chain: arbitrum,
        sparkSpellExecutor: CheckedAddress('0x65d946e533748A998B1f0E430803e39A6388f7a1'),
      },
      [optimism.id]: {
        name: 'optimism',
        chain: optimism,
        sparkSpellExecutor: CheckedAddress('0x205216D89a00FeB2a73273ceecD297BAf89d576d'),
      },
      [unichain.id]: {
        name: 'unichain',
        chain: unichain,
        sparkSpellExecutor: CheckedAddress('0xb037C43b433964A2017cd689f535BEb6B0531473'),
      },
    },
    deployer: CheckedAddress.ZERO(),
    spellsRepoPath,
  }
}
