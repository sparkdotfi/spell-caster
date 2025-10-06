import { describe, expect, test } from 'bun:test'
import { Context } from '@actions/github/lib/context'
import { templating } from '@sparkdotfi/common-reporters'
import { ForkAndExecuteSpellReturn } from '../../forkAndExecuteSpell'
import { prepareSlackNotification } from './prepareSlackNotification'

describe(prepareSlackNotification.name, () => {
  const mockContext = {
    payload: {
      pull_request: {
        html_url: 'https://pr.example.com',
      },
    },
  } as Context

  test('formats two reports', () => {
    const mockResults: ForkAndExecuteSpellReturn[] = [
      {
        spellName: 'TestSpell1',
        originChainId: 1,
        forkRpc: 'https://fork1.example.com',
        forkChainId: 1001,
        appUrl: 'https://app1.example.com',
      },
      {
        spellName: 'TestSpell2',
        originChainId: 137,
        forkRpc: 'https://fork2.example.com',
        forkChainId: 1002,
        appUrl: 'https://app2.example.com',
      },
    ]

    const result = prepareSlackNotification(mockResults, mockContext)

    expect(result).toEqual({
      title: 'Spell PR is ready for review',
      content: [
        templating.text('- TestSpell1 |'),
        templating.link('https://app1.example.com', 'App URL'),
        templating.text('|'),
        templating.link('https://fork1.example.com', 'RPC URL'),
        templating.newLine,
        templating.text('- TestSpell2 |'),
        templating.link('https://app2.example.com', 'App URL'),
        templating.text('|'),
        templating.link('https://fork2.example.com', 'RPC URL'),
        templating.newLine,
        templating.link('https://pr.example.com', 'PR URL'),
      ],
    })
  })

  test('returns undefined if no results', () => {
    const result = prepareSlackNotification([], mockContext)
    expect(result).toBeUndefined()
  })
})
