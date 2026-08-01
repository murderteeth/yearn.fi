/**
 * Public entry point for `@yearn/components`.
 *
 * The package is consumed as TypeScript source: apps list it in
 * `transpilePackages` rather than importing a build artifact.
 *
 * Components are exposed twice — individually, and grouped under the `Yearn`
 * namespace so call sites read as `<Yearn.ConnectButton />`. `@yearn/deposit`
 * re-exports that namespace with the widget merged in, so an app that uses both
 * packages still has a single `Yearn` to reach for.
 */

import { ConnectButton } from '@yearn/components/wallet/ConnectButton'

export const Yearn = {
  ConnectButton
} as const

export { IconSpinner } from '@yearn/components/icons/IconSpinner'
export { IconWallet } from '@yearn/components/icons/IconWallet'
export type { TAddress, TAddressLike, TAddressSmol, TAddressWagmi } from '@yearn/components/types/address'
export { ADDRESS_REGEX } from '@yearn/components/types/address'
export {
  getColorFromAdddress,
  isAddress,
  isTAddress,
  isZeroAddress,
  toAddress,
  toSafeAddress,
  truncateHex
} from '@yearn/components/utils/address'
export { cl } from '@yearn/components/utils/cl'
export { fetchClusterName, getClusterImageUrl } from '@yearn/components/utils/clusters'
export { isIframe } from '@yearn/components/utils/isIframe'
export { isSafeConnectorId } from '@yearn/components/utils/walletConnectors'
export type { TConnectButtonNotificationStatus, TConnectButtonProps } from '@yearn/components/wallet/ConnectButton'
export { ConnectButton } from '@yearn/components/wallet/ConnectButton'
export {
  identityChainResolver,
  type TYearnAutoConnect,
  type TYearnChainResolver,
  type TYearnWalletAnalytics,
  type TYearnWalletContext,
  YEARN_WALLET_EVENTS
} from '@yearn/components/wallet/types'
export type { TYearnWalletProviderProps } from '@yearn/components/wallet/YearnWalletProvider'
export { useYearnWallet, YearnWalletProvider } from '@yearn/components/wallet/YearnWalletProvider'
