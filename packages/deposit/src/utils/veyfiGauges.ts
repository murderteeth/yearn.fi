import type { TAddress } from '@yearn/util/types/address'
import { toAddress } from '@yearn/util/utils/address'
import { DISABLED_VEYFI_GAUGES_VAULTS_LIST } from '@yearn/vaults/constants/protocol'

export function isDisabledVeyfiGaugePair(vaultAddress: TAddress, stakingAddress: TAddress): boolean {
  return DISABLED_VEYFI_GAUGES_VAULTS_LIST.some(
    ({ address, staking }) => toAddress(address) === vaultAddress && toAddress(staking) === stakingAddress
  )
}
