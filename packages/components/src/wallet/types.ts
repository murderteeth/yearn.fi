import type { TAddress } from '@yearn/util/types/address'

/**
 * Analytics sink. The package emits events but owns no tracker — the host app
 * forwards these wherever it already sends analytics.
 */
export type TYearnWalletAnalytics = (event: string, options?: { props?: Record<string, string> }) => void

export const YEARN_WALLET_EVENTS = {
  CONNECT_WALLET: 'connect_wallet',
  DISCONNECT_WALLET: 'disconnect_wallet',
  CHANGE_NETWORK: 'change_network'
} as const

/**
 * Lets a host app run transactions on a chain other than the one it presents.
 * yearn.fi uses this for Tenderly forknets, where the UI talks about mainnet
 * while the wallet is pointed at a fork. Defaults to identity.
 */
export type TYearnChainResolver = {
  /** Map a connected wallet's chain id back to the canonical chain the UI shows. */
  toCanonicalChainId: (chainId?: number) => number | undefined
  /** Map a canonical chain id to the chain transactions must execute on. */
  toExecutionChainId: (chainId?: number) => number | undefined
}

export const identityChainResolver: TYearnChainResolver = {
  toCanonicalChainId: (chainId?: number): number | undefined => chainId,
  toExecutionChainId: (chainId?: number): number | undefined => chainId
}

/**
 * An optional connector to attach without user interaction, used for automated
 * and development wallets. `shouldConnect` is called inside the effect so it
 * can read runtime state without risking a hydration mismatch.
 */
export type TYearnAutoConnect = {
  connectorId: string
  shouldConnect: () => boolean
}

export type TYearnWalletContext = {
  address: TAddress | undefined
  ens: string | undefined
  clusters: { name: string; avatar: string } | undefined
  chainID: number
  isActive: boolean
  isWalletSafe: boolean
  isWalletLedger: boolean
  isUserConnecting: boolean
  isIdentityLoading: boolean
  openLoginModal: () => void
  onDesactivate: () => void
}
