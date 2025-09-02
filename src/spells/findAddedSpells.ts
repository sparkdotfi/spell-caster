import * as github from '@actions/github'
import { Logger } from '@sparkdotfi/common-universal/logger'
import { getFilenameWithoutExtension } from './findPendingSpells'

export async function findAddedSpells(githubToken: string, logger: Logger): Promise<string[]> {
  const octokit = github.getOctokit(githubToken)
  const context = github.context

  if (context.eventName !== 'pull_request') {
    logger.warn('Not a pull request')
    return []
  }

  const { data: files } = await octokit.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  })

  const addedProposalFiles = files.filter(
    (file) =>
      file.status === 'added' &&
      file.filename.endsWith('.sol') &&
      !file.filename.includes('.t.sol') &&
      file.filename.includes('src/proposals'),
  )

  return addedProposalFiles.map((file) => getFilenameWithoutExtension(file.filename))
}
