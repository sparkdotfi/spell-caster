import * as fs from 'fs';
import * as path  from 'path';
import * as glob from 'glob';

export function findPendingSpells(projectRootPath: string): string[] {
  const proposalsDirPath = path.join(projectRootPath, 'src/proposals');

  if (!fs.existsSync(proposalsDirPath)) {
    throw new Error(`Directory not found: ${proposalsDirPath}`);
  }

  const spellsAndTests = glob.globSync('**/*.sol', { cwd: proposalsDirPath, absolute: true })

  const spellPaths = spellsAndTests.filter((path) => !path.includes('.t.sol'));

  return spellPaths.map(removeExtension);
}

function removeExtension(fullPath: string): string {
  const parsedPath = path.parse(fullPath);
  const pathWithoutExtension = path.join(parsedPath.dir, parsedPath.name);

  return pathWithoutExtension;
}