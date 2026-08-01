'use client'

import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YearnWalletProvider } from '@yearn/components'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { demoWagmiConfig } from './wagmi'

/**
 * The provider stack a consumer needs around `YearnWalletProvider`: wagmi for
 * the connection, TanStack Query for wagmi's caching, and RainbowKit for the
 * connect modal the button opens.
 */
export function DemoProviders({ children }: { children: ReactNode }): ReactElement {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={demoWagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <YearnWalletProvider>{children}</YearnWalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
