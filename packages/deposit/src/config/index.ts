import type { Chain } from 'viem'

/**
 * Everything `@yearn/deposit` needs from its host that it cannot know itself.
 *
 * This is a module-level singleton rather than a React context on purpose: much
 * of the widget's supporting code reads these at module scope (`const IDS =
 * chains().map(...)`), which a context cannot serve. The host calls
 * `configureYearnDeposit` once during startup, before anything renders.
 *
 * Every field has a working default, so a consumer with no Tenderly forknets,
 * no analytics, and the standard chain set can mount the widget without calling
 * `configureYearnDeposit` at all.
 */
export type TDepositConfig = {
  /** The chains the host presents. */
  chains: readonly Chain[]
  /** Chains transactions may be signed on — usually the same as `chains`. */
  walletChains: readonly Chain[]
  /**
   * Maps between the chain the UI displays and the chain transactions actually
   * execute on. yearn.fi supplies its Tenderly resolver here; the default is
   * identity, which is correct for every host that does not fork.
   */
  toExecutionChainId: (chainId?: number) => number | undefined
  toCanonicalChainId: (chainId?: number) => number | undefined
  /** True when the connected wallet is already on the execution chain. */
  isConnectedToExecutionChain: (connectedChainId?: number, canonicalChainId?: number) => boolean
  /** True when the host is running against a forked network. */
  isForkedNetwork: () => boolean
  /**
   * Per-chain RPC endpoint override.
   *
   * This has to come from the host rather than being read here: Next only
   * inlines `process.env.NEXT_PUBLIC_*` into the client bundle when the
   * reference is statically analysable, and a per-chain lookup is a computed
   * key. The host resolves it from an object whose values were inlined at their
   * own static references. Returning undefined falls back to the chain's
   * default RPC.
   */
  rpcUri: (chainId: number) => string | undefined
  /** RPC endpoint for a forked execution chain, when the host has one. */
  forkedRpcUri: (chainId?: number) => string | undefined
  /** Block explorer for a forked execution chain, when the host has one. */
  forkedExplorerUri: (chainId?: number) => string | undefined
  /** Where widget events are forwarded. */
  analytics: (event: string, options?: { props?: Record<string, string> }) => void
  /** Referral address recorded on deposits, when the host has one. */
  partnerAddress?: string
}

const identity = (chainId?: number): number | undefined => chainId

const DEFAULTS: TDepositConfig = {
  chains: [],
  walletChains: [],
  toExecutionChainId: identity,
  toCanonicalChainId: identity,
  isConnectedToExecutionChain: (connectedChainId, canonicalChainId) =>
    connectedChainId !== undefined && connectedChainId === canonicalChainId,
  isForkedNetwork: () => false,
  rpcUri: () => undefined,
  forkedRpcUri: () => undefined,
  forkedExplorerUri: () => undefined,
  analytics: () => undefined,
  partnerAddress: undefined
}

const state: { current: TDepositConfig } = { current: DEFAULTS }

/**
 * Supply host configuration. Call once, before rendering. Partial — anything
 * omitted keeps its default.
 */
export function configureYearnDeposit(next: Partial<TDepositConfig>): void {
  state.current = { ...state.current, ...next }
}

/** Read the current configuration. Always call through this, never cache it. */
export function depositConfig(): TDepositConfig {
  return state.current
}

export { WIDGET_EVENTS } from '@yearn/deposit/config/events'
