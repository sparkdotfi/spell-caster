import assert from 'node:assert'
import core from '@actions/core'
import github from '@actions/github'
import { createCommentOrUpdate } from '@superactions/comment'
import { CreateOrUpdateReponse } from '@superactions/comment/dist/github/types'
import dedent from 'dedent'
import { markdownTable } from 'markdown-table'
import { buildActionDependencies } from '../buildDependencies'
import { ForkAndExecuteSpellReturn, forkAndExecuteSpell } from '../forkAndExecuteSpell'
import { prepareSlackNotification } from '../periphery/reporter/prepareSlackNotification'
import { findModifiedSpells } from '../spells/findModifiedSpells'

async function main(): Promise<void> {
  const { reportSender, config, logger } = buildActionDependencies()

  const modifiedSpellNames = await findModifiedSpells(config.secrets.githubToken, logger)
  logger.info(`Modified spells: ${modifiedSpellNames.join(', ')}`)

  if (modifiedSpellNames.length === 0) {
    return
  }

  const forkResults = await Promise.all(modifiedSpellNames.map((spellName) => forkAndExecuteSpell(spellName, config)))

  const { status } = await postGithubComment(forkResults, config.secrets.githubToken)

  logger.info(`Results: ${JSON.stringify(forkResults)}`)

  if (status === 'updated') {
    return
  }

  const report = prepareSlackNotification(forkResults)

  if (report) {
    await reportSender.send([report])
  }
}

await main().catch((error) => {
  core.setFailed(error)
})

const uniqueAppId = 'spark-spells-action'
async function postGithubComment(
  results: ForkAndExecuteSpellReturn[],
  githubToken: string,
): Promise<CreateOrUpdateReponse> {
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
    githubToken,
    message,
    uniqueAppId: uniqueAppId,
  })
}

function getPrSha(): string {
  const context = github.context

  assert(context.eventName === 'pull_request', 'This action can only be run on pull requests')

  return context.payload.pull_request!.head.sha
}
