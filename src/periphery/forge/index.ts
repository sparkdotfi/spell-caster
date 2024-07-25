import { $ } from 'dax-sh'
import { Address } from 'viem'

export async function deployContract({
  contractName,
  rpc,
  from,
  cwd,
}: { contractName: string; rpc: string; from: Address; cwd: string }): Promise<Address> {
  const result = await $`forge create --rpc-url ${rpc} --from ${from} ${contractName} --unlocked --json`.cwd(cwd).json()
  return result.deployedTo
}
