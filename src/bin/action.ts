import assert from 'node:assert'
import core from '@actions/core'
import github from '@actions/github'
import { createCommentOrUpdate } from '@superactions/comment'
import { CreateOrUpdateReponse } from '@superactions/comment/dist/github/types'
import dedent from 'dedent'
import { markdownTable } from 'markdown-table'
import { buildDependencies } from '../buildDependencies'
import { ForkAndExecuteSpellReturn, forkAndExecuteSpell } from '../forkAndExecuteSpell'
import { prepareSlackNotification } from '../periphery/reporter/prepareSlackNotification'
import { findPendingSpells } from '../spells/findPendingSpells'

async function main(): Promise<void> {
  const { reportSender, config } = buildDependencies()

  const allPendingSpellNames = findPendingSpells(process.cwd())
  core.info(`Pending spells: ${allPendingSpellNames.join(', ')}`)

  const results = await Promise.all(allPendingSpellNames.map((spellName) => forkAndExecuteSpell(spellName, config)))

  const { status } = await postGithubComment(results)

  if (status === 'created') {
    const report = prepareSlackNotification(results)
    await reportSender.send([report])
  }

  core.info(`Results: ${JSON.stringify(results)}`)
}

await main().catch((error) => {
  core.setFailed(error)
})

const uniqueAppId = 'spark-spells-action'
async function postGithubComment(results: ForkAndExecuteSpellReturn[]): Promise<CreateOrUpdateReponse> {
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
  return await createCommentOrUpdate({
    githubToken: core.getInput('github-token'),
    message,
    uniqueAppId: uniqueAppId,
  })
}

function getPrSha(): string {
  const context = github.context

  assert(context.eventName === 'pull_request', 'This action can only be run on pull requests')

  return context.payload.pull_request!.head.sha
}
