import { xLayer } from 'viem/chains'
import { getChainIdFromSpellName } from '../utils/getChainIdFromSpellName'

const chainIdsNotSupportedByTenderly: number[] = [xLayer.id]

export function isSupportedByTenderly(spellName: string): boolean {
  return !chainIdsNotSupportedByTenderly.includes(getChainIdFromSpellName(spellName))
}
