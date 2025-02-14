import core from '@actions/core'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { $ } from 'dax-sh'
import { Address } from 'viem'

export async function deployContract({
  contractName,
  rpc,
  from,
  cwd,
}: { contractName: string; rpc: string; from: Address; cwd: string }): Promise<CheckedAddress> {
  const result = await $`forge create  --broadcast --rpc-url ${rpc} --from ${from} ${contractName} --unlocked --json`
    .cwd(cwd)
    .json()
  core.info(`Deployed spell ${contractName} to address ${result.deployedTo}`)
  return CheckedAddress(result.deployedTo)
}
