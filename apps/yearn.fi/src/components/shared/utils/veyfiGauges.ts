import { DISABLED_VEYFI_GAUGES_VAULTS_LIST } from '@shared/utils/constants'
import type { TAddress } from '@yearn/util/types/address'
import { toAddress } from '@yearn/util/utils/address'

export function isDisabledVeyfiGaugePair(vaultAddress: TAddress, stakingAddress: TAddress): boolean {
  return DISABLED_VEYFI_GAUGES_VAULTS_LIST.some(
    ({ address, staking }) => toAddress(address) === vaultAddress && toAddress(staking) === stakingAddress
  )
}
