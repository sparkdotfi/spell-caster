import core from '@actions/core'
import { forkAndExecuteSpell } from '..'
import { getConfig } from '../config'
import { getRequiredGithubInput } from '../config/environments/action'
import { findPendingSpells } from '../spells/findPendingSpells'

async function main(): Promise<void> {
  const config = getConfig(getRequiredGithubInput)

  const allPendingSpellNames = findPendingSpells(process.cwd())
  core.info(`Pending spells: ${allPendingSpellNames.join(', ')}`)

  const results = await Promise.all(allPendingSpellNames.map((spellName) => forkAndExecuteSpell(spellName, config)))

  core.info(`Results: ${JSON.stringify(results)}`)
}

await main().catch((error) => {
  core.setFailed(error)
})
