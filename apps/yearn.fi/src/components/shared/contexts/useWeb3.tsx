'use client'

import { usePlausible } from '@hooks/usePlausible'
import { type TYearnChainResolver, useYearnWallet, YearnWalletProvider } from '@yearn/components'
import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { AGENT_WALLET_ID, shouldAutoConnectAgentWallet } from '@/config/agentWallet'
import { resolveConnectedCanonicalChainId, resolveExecutionChainId } from '@/config/tenderly'

/**
 * The wallet layer lives in `@yearn/components`. This file supplies the two
 * things the package deliberately does not own — where analytics go, and how
 * yearn.fi maps a displayed chain to the chain transactions execute on for
 * Tenderly forknets — and keeps the `useWeb3` name the app already imports.
 */

const tenderlyChainResolver: TYearnChainResolver = {
  toCanonicalChainId: resolveConnectedCanonicalChainId,
  toExecutionChainId: resolveExecutionChainId
}

const agentAutoConnect = {
  connectorId: AGENT_WALLET_ID,
  shouldConnect: shouldAutoConnectAgentWallet
}

export const Web3ContextApp = (props: { children: ReactElement }): ReactElement => {
  const trackEvent = usePlausible()

  const analytics = useMemo(
    () =>
      (event: string, options?: { props?: Record<string, string> }): void => {
        trackEvent(event, options ?? {})
      },
    [trackEvent]
  )

  return (
    <YearnWalletProvider analytics={analytics} chainResolver={tenderlyChainResolver} autoConnect={agentAutoConnect}>
      {props.children}
    </YearnWalletProvider>
  )
}

export const useWeb3 = useYearnWallet
