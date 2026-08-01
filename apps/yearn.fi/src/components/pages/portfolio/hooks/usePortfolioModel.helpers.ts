import { toAddress } from '@yearn/util/utils/address'
import { getVaultAddress, type TKongVaultInput } from '@yearn/vaults/domain/kongVaultSelectors'
import { YVUSD_CHAIN_ID, YVUSD_LOCKED_ADDRESS, YVUSD_UNLOCKED_ADDRESS } from '@yearn/vaults/utils/yvUsd'

function getChainAddressKey(chainID: number | undefined, address: string): string {
  return `${chainID}_${toAddress(address)}`
}

export function hasYvUsdPortfolioHoldings(holdingsKeySet: Set<string>): boolean {
  return [YVUSD_UNLOCKED_ADDRESS, YVUSD_LOCKED_ADDRESS].some((address) =>
    holdingsKeySet.has(getChainAddressKey(YVUSD_CHAIN_ID, address))
  )
}

export function resolveYvUsdFollowOnSuggestionVault({
  pinnedVault,
  candidateVault,
  unlockedVault
}: {
  pinnedVault?: TKongVaultInput | null
  candidateVault: TKongVaultInput
  unlockedVault?: TKongVaultInput | null
}): TKongVaultInput {
  const pinnedAddress = pinnedVault ? getVaultAddress(pinnedVault) : null
  const candidateAddress = getVaultAddress(candidateVault)

  if (pinnedAddress === YVUSD_LOCKED_ADDRESS && candidateAddress === YVUSD_LOCKED_ADDRESS && unlockedVault) {
    return unlockedVault
  }

  return candidateVault
}
