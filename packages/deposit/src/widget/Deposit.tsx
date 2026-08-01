'use client'

import { useYearnWallet } from '@yearn/components'
import { useYearn } from '@yearn/deposit/contexts/useYearn'
import { useVaultUserData } from '@yearn/deposit/hooks/useVaultUserData'
import { WidgetActionType } from '@yearn/deposit/types/index'
import { type TWidgetRef, Widget } from '@yearn/deposit/widget/index'
import { WidgetLoadingSkeleton } from '@yearn/deposit/widget/shared/WidgetLoadingSkeleton'
import type { TAddress } from '@yearn/util/types/address'
import { toAddress } from '@yearn/util/utils/address'
import { getVaultAddress, getVaultStaking, getVaultToken } from '@yearn/vaults/domain/kongVaultSelectors'
import { forwardRef, type ReactElement } from 'react'

export type TDepositProps = {
  /** Chain the vault lives on. */
  chainId: number
  /** Vault address. */
  address: TAddress
  /** Which tabs to offer. Defaults to deposit and withdraw. */
  actions?: WidgetActionType[]
  /** Which tab opens first. */
  mode?: WidgetActionType
  onModeChange?: (mode: WidgetActionType) => void
  /** Fired after a transaction confirms. */
  onSuccess?: () => void
  showTabs?: boolean
  disableBorderRadius?: boolean
  collapseDetails?: boolean
}

const DEFAULT_ACTIONS = [WidgetActionType.Deposit, WidgetActionType.Withdraw]

/**
 * The whole deposit and withdraw experience for one vault.
 *
 * This is the entry point most consumers want: give it a chain and an address
 * and it resolves the vault and the connected account's position itself.
 * `Widget` remains available for hosts that already hold that data — yearn.fi's
 * vault detail page passes it down rather than fetching twice.
 *
 * Requires `YearnVaultProvider` above it.
 */
export const Deposit = forwardRef<TWidgetRef, TDepositProps>(function Deposit(
  { chainId, address, actions = DEFAULT_ACTIONS, mode, onModeChange, onSuccess, showTabs = true, ...rest },
  ref
): ReactElement {
  const { vaults } = useYearn()
  const { address: account } = useYearnWallet()

  const currentVault = vaults[toAddress(address)]
  const staking = currentVault ? getVaultStaking(currentVault) : undefined

  const vaultUserData = useVaultUserData({
    vaultAddress: toAddress(address),
    assetAddress: toAddress(currentVault ? getVaultToken(currentVault)?.address : undefined),
    stakingAddress: staking?.address ? toAddress(staking.address) : undefined,
    stakingSource: staking?.source,
    chainId,
    account,
    enabled: Boolean(currentVault)
  })

  // Rendered rather than guarded inside an effect: until the vault list
  // resolves there is nothing for the widget to show.
  if (!currentVault) {
    return <WidgetLoadingSkeleton title={'Deposit'} disableBorderRadius={rest.disableBorderRadius} />
  }

  return (
    <Widget
      ref={ref}
      chainId={chainId}
      vaultAddress={getVaultAddress(currentVault)}
      currentVault={currentVault}
      gaugeAddress={staking?.address ? toAddress(staking.address) : undefined}
      actions={actions}
      vaultUserData={vaultUserData}
      handleSuccess={onSuccess}
      mode={mode}
      onModeChange={onModeChange}
      showTabs={showTabs}
      {...rest}
    />
  )
})
