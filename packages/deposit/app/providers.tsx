'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YearnWalletProvider } from '@yearn/components'
import { configureYearnDeposit, YearnVaultProvider } from '@yearn/deposit'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains'

const CHAINS = [mainnet, optimism, polygon, base, arbitrum] as const

const wagmiConfig = getDefaultConfig({
  appName: 'Yearn Deposit',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'yearn-deposit-demo',
  chains: CHAINS,
  ssr: true
})

/**
 * Configuration is applied at module scope, before any component renders, which
 * is what the widget's supporting code expects. This demo forks nothing and
 * tracks nothing, so it only needs to name its chains — every other field keeps
 * its default. That is the minimum a consumer has to provide.
 */
configureYearnDeposit({
  chains: CHAINS,
  walletChains: CHAINS
})

export function DemoProviders({ children }: { children: ReactElement }): ReactElement {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <YearnWalletProvider>
            <YearnVaultProvider>{children}</YearnVaultProvider>
          </YearnWalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
