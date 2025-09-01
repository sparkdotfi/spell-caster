import { ContentBlock, Report, templating } from '@sparkdotfi/common-reporters'
import { ForkAndExecuteSpellReturn } from '../../forkAndExecuteSpell'

export function prepareSlackNotification(results: ForkAndExecuteSpellReturn[]): Report {
  const data = results.flatMap(spellSection)

  return {
    title: 'New spell is ready for review',
    content: data,
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
