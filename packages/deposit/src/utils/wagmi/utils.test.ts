import { configureYearnDeposit } from '@yearn/deposit/config'
import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, it } from 'vitest'

const TENDERLY_CHAIN_ID = 73571

describe('getNetwork', () => {
  afterEach(() => {
    configureYearnDeposit({
      chains: [],
      toExecutionChainId: (chainId?: number) => chainId,
      forkedRpcUri: () => undefined,
      forkedExplorerUri: () => undefined
    })
  })

  it('leaves the default block explorer empty for forked execution chains without explicit explorer URIs', async () => {
    configureYearnDeposit({
      toExecutionChainId: (chainId?: number) => chainId,
      forkedExplorerUri: () => undefined,
      forkedRpcUri: (chainId?: number) =>
        chainId === TENDERLY_CHAIN_ID ? 'https://rpc.tenderly.ethereum.example' : undefined,
      chains: [{ ...mainnet, id: TENDERLY_CHAIN_ID, name: 'Ethereum Tenderly', blockExplorers: undefined }]
    })

    const { getNetwork } = await import('@yearn/deposit/utils/wagmi/utils')

    expect(getNetwork(TENDERLY_CHAIN_ID).defaultBlockExplorer).toBe('')
  })
})
