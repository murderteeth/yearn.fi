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
 * this app presents, how a displayed chain maps to the chain transactions
 * execute on under Tenderly, and where analytics go.
 *
 * Imported for its side effect from the provider tree, so it runs once before
 * anything renders. The widget's supporting code reads this at module scope, so
 * it cannot be a React context.
 */
export function configureDepositWidget(
  analytics: (event: string, options?: { props?: Record<string, string> }) => void
): void {
  configureYearnDeposit({
    chains: SUPPORTED_NETWORKS,
    walletChains: supportedWalletChains,
    toExecutionChainId: resolveExecutionChainId,
    toCanonicalChainId: resolveConnectedCanonicalChainId,
    isConnectedToExecutionChain,
    isForkedNetwork: isTenderlyModeEnabled,
    forkedRpcUri: resolveTenderlyRpcUriForExecutionChainId,
    forkedExplorerUri: resolveTenderlyExplorerUriForExecutionChainId,
    analytics,
    partnerAddress: env.NEXT_PUBLIC_PARTNER_ID_ADDRESS
  })
}
