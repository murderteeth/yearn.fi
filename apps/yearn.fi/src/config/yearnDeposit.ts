import { configureYearnDeposit } from '@yearn/deposit/config'
import { SUPPORTED_NETWORKS, supportedWalletChains } from '@/config/supportedChains'
import {
  isConnectedToExecutionChain,
  isTenderlyModeEnabled,
  resolveConnectedCanonicalChainId,
  resolveExecutionChainId,
  resolveTenderlyExplorerUriForExecutionChainId,
  resolveTenderlyRpcUriForExecutionChainId
} from '@/config/tenderly'
import { env } from '@/env'

/**
 * Hands `@yearn/deposit` the things it deliberately does not own: which chains
 * this app presents, where to find an RPC for each, how a displayed chain maps
 * to the chain transactions execute on under Tenderly, and where analytics go.
 *
 * Split in two because of when each part is needed. Everything static must be
 * in place before `@/config/wagmi` builds its transports, which it does at
 * module scope — long before React renders. Analytics comes from a hook, so it
 * arrives later; nothing reads it until a user acts.
 */
export function configureDepositWidget(): void {
  configureYearnDeposit({
    chains: SUPPORTED_NETWORKS,
    walletChains: supportedWalletChains,
    toExecutionChainId: resolveExecutionChainId,
    toCanonicalChainId: resolveConnectedCanonicalChainId,
    isConnectedToExecutionChain,
    isForkedNetwork: isTenderlyModeEnabled,
    // `env` is a plain object built from static `process.env.NEXT_PUBLIC_*`
    // references, so Next has already inlined each value into the client
    // bundle. Indexing it by chain id at runtime is therefore safe, whereas
    // indexing `process.env` itself would resolve to undefined in the browser.
    rpcUri: (chainId: number): string | undefined => {
      const value = env[`NEXT_PUBLIC_RPC_URI_FOR_${chainId}`]
      return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
    },
    forkedRpcUri: resolveTenderlyRpcUriForExecutionChainId,
    forkedExplorerUri: resolveTenderlyExplorerUriForExecutionChainId,
    partnerAddress: env.NEXT_PUBLIC_PARTNER_ID_ADDRESS
  })
}

// Applied on import, not only when called: anything reaching for a chain's RPC
// through the widget package must see this configuration, whether or not it
// happens to have imported `@/config/wagmi` first.
configureDepositWidget()

/** Supplies the analytics sink once the tracker hook is available. */
export function setDepositAnalytics(
  analytics: (event: string, options?: { props?: Record<string, string> }) => void
): void {
  configureYearnDeposit({ analytics })
}
