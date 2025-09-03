import * as path from 'node:path'
import * as github from '@actions/github'
import { Logger } from '@sparkdotfi/common-universal/logger'

export async function findModifiedSpells(githubToken: string, logger: Logger): Promise<string[]> {
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
      ['added', 'renamed', 'modified'].includes(file.status) &&
      file.filename.endsWith('.sol') &&
      !file.filename.includes('.t.sol') &&
      file.filename.includes('src/proposals'),
  )

  return addedProposalFiles.map((file) => getFilenameWithoutExtension(file.filename))
}

export function getFilenameWithoutExtension(fullPath: string): string {
  const parsedPath = path.parse(fullPath)
  return parsedPath.name
}
