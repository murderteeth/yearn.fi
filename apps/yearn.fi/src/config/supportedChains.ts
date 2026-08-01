import type { Chain } from 'viem'
import { arbitrum, base, fantom, mainnet, optimism, polygon, sonic } from 'viem/chains'
import type { TCanonicalChainId } from './chainDefinitions'
import { supportedCanonicalChains, supportedExecutionChains } from './tenderly'

export const supportedChains = supportedCanonicalChains
export const supportedAppChains = supportedCanonicalChains
export const supportedWalletChains = supportedExecutionChains

export type TSupportedChainId = TCanonicalChainId
export type TSupportedChain = Chain

/**
 * The chains the app presents, falling back to the full set when none are
 * configured. Lives here rather than in `@shared/utils/constants` because it is
 * derived from app configuration — keeping it there chained every consumer of a
 * plain address constant into `supportedChains` → `tenderly` → `env`.
 */
export const SUPPORTED_NETWORKS = supportedAppChains.length
  ? supportedAppChains
  : [mainnet, optimism, polygon, fantom, base, arbitrum, sonic]
