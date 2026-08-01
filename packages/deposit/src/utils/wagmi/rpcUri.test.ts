import { configureYearnDeposit } from '@yearn/deposit/config'
import { getRpcUriFor } from '@yearn/deposit/utils/wagmi/utils'
import { afterEach, describe, expect, it } from 'vitest'

/**
 * The per-chain RPC endpoint has to arrive through configuration rather than
 * being read from `process.env` inside the package. Next only inlines
 * `process.env.NEXT_PUBLIC_*` into the client bundle when the reference is
 * statically analysable, so a computed `process.env[key]` lookup silently
 * resolves to undefined in the browser and wagmi falls back to viem's default
 * public RPC — which is exactly the regression this covers.
 */
describe('getRpcUriFor', () => {
  afterEach(() => {
    configureYearnDeposit({ rpcUri: () => undefined, forkedRpcUri: () => undefined })
  })

  it('returns the endpoint the host configured for that chain', () => {
    configureYearnDeposit({
      rpcUri: (chainId) => (chainId === 1 ? 'https://rpc.example/mainnet' : undefined)
    })

    expect(getRpcUriFor(1)).toBe('https://rpc.example/mainnet')
  })

  it('accepts a chain id given as a string', () => {
    configureYearnDeposit({ rpcUri: (chainId) => (chainId === 10 ? 'https://rpc.example/op' : undefined) })

    expect(getRpcUriFor('10')).toBe('https://rpc.example/op')
  })

  it('returns an empty string when the host configures nothing, so callers fall back', () => {
    expect(getRpcUriFor(137)).toBe('')
  })

  it('prefers a forked endpoint over the configured one', () => {
    configureYearnDeposit({
      rpcUri: () => 'https://rpc.example/mainnet',
      forkedRpcUri: (chainId) => (chainId === 1 ? 'https://rpc.tenderly.example/fork' : undefined)
    })

    expect(getRpcUriFor(1)).toBe('https://rpc.tenderly.example/fork')
  })
})
