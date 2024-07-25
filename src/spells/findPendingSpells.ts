import * as fs from 'node:fs'
import * as path from 'node:path'
import * as glob from 'glob'

export function findPendingSpells(projectRootPath: string): string[] {
  const proposalsDirPath = path.join(projectRootPath, 'src/proposals')

  if (!fs.existsSync(proposalsDirPath)) {
    throw new Error(`Directory not found: ${proposalsDirPath}`)
  }

  const spellsAndTests = glob.globSync('**/*.sol', { cwd: proposalsDirPath, absolute: true })

  const spellPaths = spellsAndTests.filter((path) => !path.includes('.t.sol'))

  return spellPaths.map(getFilenameWithoutExtension)
}

export function getFilenameWithoutExtension(fullPath: string): string {
  const parsedPath = path.parse(fullPath);
  return parsedPath.name;
}