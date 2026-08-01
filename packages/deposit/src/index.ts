/**
 * Public entry point for `@yearn/deposit`.
 *
 * The package is consumed as TypeScript source: apps list it in
 * `transpilePackages` rather than importing a build artifact.
 *
 * The `Yearn` namespace merges `@yearn/components`, so an app using both still
 * has a single object to reach for — `<Yearn.ConnectButton />` and
 * `<Yearn.Deposit />` come from the same import.
 *
 * Server routes are reached through the `./server/*` subpath, and contract ABIs
 * through `@yearn/vaults/abi/*`, so neither is pulled in by importing this.
 */

import { Yearn as YearnComponents } from '@yearn/components'
import { Deposit } from '@yearn/deposit/widget/Deposit'
import { Widget } from '@yearn/deposit/widget/index'
import { WidgetRewards } from '@yearn/deposit/widget/rewards/index'
import { WalletPanel } from '@yearn/deposit/widget/WalletPanel'

export const Yearn = {
  ...YearnComponents,
  /** The whole deposit and withdraw experience for one vault. */
  Deposit,
  /** Prop-driven shell, for hosts that already hold the vault and user data. */
  Widget,
  /** Claimable staking and Merkl rewards for a vault. */
  Rewards: WidgetRewards,
  /** Balances, pending transactions, and cooldown state for the connected account. */
  WalletPanel
} as const

export type { TDepositConfig } from '@yearn/deposit/config'
export { configureYearnDeposit, depositConfig, WIDGET_EVENTS } from '@yearn/deposit/config'
export { WidgetActionType } from '@yearn/deposit/types/index'
export type { TDepositProps } from '@yearn/deposit/widget/Deposit'
export { Deposit } from '@yearn/deposit/widget/Deposit'
export type { TWidgetRef } from '@yearn/deposit/widget/index'
export { Widget } from '@yearn/deposit/widget/index'
export type { TYearnVaultProviderProps } from '@yearn/deposit/YearnVaultProvider'
export { YearnVaultProvider } from '@yearn/deposit/YearnVaultProvider'
