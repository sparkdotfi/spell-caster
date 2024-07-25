import { CreateTenderlyVnetResult, TenderlyVnetClient } from './TenderlyVnetClient'

export async function createTenderlyVNet(opts: {
  apiKey: string
  account: string
  project: string
  originChainId: number
  forkChainId: number
}): Promise<CreateTenderlyVnetResult> {
  const client = new TenderlyVnetClient(opts)
  const vnet = await client.create({
    forkChainId: opts.forkChainId,
    originChainId: opts.originChainId,
    name: `spark-spell-${Date.now()}`,
  })

  return vnet
}

export function getRandomChainId(): number {
  return Number.parseInt(`3030${Date.now()}`)
}
