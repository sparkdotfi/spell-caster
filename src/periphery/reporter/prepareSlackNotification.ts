import { Context } from '@actions/github/lib/context'
import { ContentBlock, Report, templating } from '@sparkdotfi/common-reporters'
import { ForkAndExecuteSpellReturn } from '../../forkAndExecuteSpell'

export function prepareSlackNotification(results: ForkAndExecuteSpellReturn[], context: Context): Report | undefined {
  if (results.length === 0) {
    return
  }

  const data = results.flatMap(spellSection)

  const prUrl = context.payload.pull_request?.html_url
  const prContent = prUrl ? templating.link(prUrl, 'PR URL') : templating.text('')

  return {
    title: 'Spell PR is ready for review',
    content: [...data, prContent],
  }
}

function spellSection(result: ForkAndExecuteSpellReturn): ContentBlock[] {
  return [
    templating.text(`- ${result.spellName} |`),
    templating.link(result.appUrl, 'App URL'),
    templating.text('|'),
    templating.link(result.forkRpc, 'RPC URL'),
    templating.newLine,
  ]
}
