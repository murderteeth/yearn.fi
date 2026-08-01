'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YearnContextApp } from '@yearn/deposit/contexts/useYearn'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { AppClientEffects } from '@/AppClientEffects'

function AppPublicProviderContent({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <AppClientEffects />
      {children}
    </>
  )
}

export function AppPublicProviders({ children }: { children: ReactNode }): ReactElement {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <YearnContextApp>
        <AppPublicProviderContent>{children}</AppPublicProviderContent>
      </YearnContextApp>
    </QueryClientProvider>
  )
}
