import assert from 'node:assert'
import core from '@actions/core'
import github from '@actions/github'
import { createCommentOrUpdate } from '@superactions/comment'
import dedent from 'dedent'
import { markdownTable } from 'markdown-table'
import { ForkAndExecuteSpellReturn, forkAndExecuteSpell } from '..'
import { getConfig } from '../config'
import { getRequiredGithubInput } from '../config/environments/action'
import { findPendingSpells } from '../spells/findPendingSpells'

async function main(): Promise<void> {
  const config = getConfig(getRequiredGithubInput, process.cwd())

  const allPendingSpellNames = findPendingSpells(process.cwd())
  core.info(`Pending spells: ${allPendingSpellNames.join(', ')}`)

  const results = await Promise.all(allPendingSpellNames.map((spellName) => forkAndExecuteSpell(spellName, config)))

  await postGithubComment(results)

  core.info(`Results: ${JSON.stringify(results)}`)
}

await main().catch((error) => {
  core.setFailed(error)
})

const uniqueAppId = 'spark-spells-action'
async function postGithubComment(results: ForkAndExecuteSpellReturn[]): Promise<void> {
  const now = new Date().toISOString()
  const sha = getPrSha()
  const table = [
    ['Spell', 'App URL', 'RPC URL'],
    ...results.map((result) => [result.spellName, `[🎇 App](${result.appUrl})`, `[🌎 RPC](${result.forkRpc})`]),
  ]
  const message = dedent`
  ## Spell Caster
  
  Inspect the impact of spell execution on forked networks:

  ${markdownTable(table)}

  <sub>Deployed from ${sha} on ${now}</sub>
  `
  await createCommentOrUpdate({ githubToken: core.getInput('github-token'), message, uniqueAppId: uniqueAppId })
}

function getPrSha(): string {
  const context = github.context

  assert(context.eventName === 'pull_request', 'This action can only be run on pull requests')

  return context.payload.pull_request!.head.sha
}
