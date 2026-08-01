'use client'

import { useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { isAddress, toAddress } from '@yearn/components/utils/address'
import { fetchClusterName, getClusterImageUrl } from '@yearn/components/utils/clusters'
import { isIframe } from '@yearn/components/utils/isIframe'
import { isSafeConnectorId } from '@yearn/components/utils/walletConnectors'
import {
  identityChainResolver,
  type TYearnAutoConnect,
  type TYearnChainResolver,
  type TYearnWalletAnalytics,
  type TYearnWalletContext,
  YEARN_WALLET_EVENTS
} from '@yearn/components/wallet/types'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { mainnet } from 'viem/chains'
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'

const defaultState: TYearnWalletContext = {
  address: undefined,
  ens: undefined,
  clusters: undefined,
  chainID: 1,
  isActive: false,
  isWalletSafe: false,
  isWalletLedger: false,
  isUserConnecting: false,
  isIdentityLoading: false,
  openLoginModal: (): void => undefined,
  onDesactivate: (): void => undefined
}

const YearnWalletContext = createContext<TYearnWalletContext>(defaultState)

const noopAnalytics: TYearnWalletAnalytics = (): void => undefined

export type TYearnWalletProviderProps = {
  children: ReactNode
  /** Where to forward connect / disconnect / network-change events. */
  analytics?: TYearnWalletAnalytics
  /** Maps between the chain the UI shows and the chain transactions run on. */
  chainResolver?: TYearnChainResolver
  /** A connector to attach without user interaction. */
  autoConnect?: TYearnAutoConnect
}

/**
 * Owns wallet identity and the connect/disconnect lifecycle. It expects a
 * `WagmiProvider` and a `RainbowKitProvider` above it — it consumes RainbowKit's
 * modal hooks rather than rendering RainbowKit's own button, so the host app
 * controls the button's appearance.
 */
export function YearnWalletProvider({
  children,
  analytics = noopAnalytics,
  chainResolver = identityChainResolver,
  autoConnect
}: TYearnWalletProviderProps): ReactElement {
  const { address, isConnecting, isConnected, connector, chain } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address: isConnected ? address : undefined,
    chainId: mainnet.id
  })
  const { openAccountModal } = useAccountModal()
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const [clusters, setClusters] = useState<{ name: string; avatar: string } | undefined>(undefined)
  const [isFetchingClusters, setIsFetchingClusters] = useState(false)
  const wasConnectedRef = useRef(false)
  const previousChainIDRef = useRef<number | undefined>(undefined)
  const hasUserRequestedConnectionRef = useRef(false)
  const hasAutoConnectedRef = useRef(false)

  const { toCanonicalChainId, toExecutionChainId } = chainResolver
  const chainID = toCanonicalChainId(chain?.id) ?? (isConnected ? 0 : 1)

  // Effect: fires analytics on a connection transition. There is no event
  // handler to hang this off — the connection can complete outside our UI.
  useEffect(() => {
    if (!wasConnectedRef.current && isConnected && hasUserRequestedConnectionRef.current) {
      analytics(YEARN_WALLET_EVENTS.CONNECT_WALLET, {
        props: { connector: connector?.name ?? '', chainID: String(chainID) }
      })
      hasUserRequestedConnectionRef.current = false
    }
    wasConnectedRef.current = isConnected
  }, [isConnected, connector, chainID, analytics])

  // Effect: same reason — the chain can change from inside the wallet itself.
  useEffect(() => {
    if (isConnected && previousChainIDRef.current !== undefined && previousChainIDRef.current !== chainID) {
      analytics(YEARN_WALLET_EVENTS.CHANGE_NETWORK, {
        props: { fromChainID: String(previousChainIDRef.current), toChainID: String(chainID) }
      })
    }
    if (isConnected) {
      previousChainIDRef.current = chainID
    } else {
      previousChainIDRef.current = undefined
    }
  }, [isConnected, chainID, analytics])

  // Effect: attaches the auto-connect connector once the connector list is
  // populated. `shouldConnect` is read here rather than during render so it may
  // touch browser-only state without causing a hydration mismatch.
  useEffect(() => {
    if (!autoConnect || hasAutoConnectedRef.current || isConnected || isConnecting || !autoConnect.shouldConnect()) {
      return
    }

    const target = connectors.find((eachConnector) => eachConnector.id === autoConnect.connectorId)
    if (!target) {
      return
    }

    hasAutoConnectedRef.current = true
    hasUserRequestedConnectionRef.current = true
    void connectAsync({
      connector: target,
      chainId: toExecutionChainId(chainID) ?? chainID
    }).catch((error) => {
      hasAutoConnectedRef.current = false
      hasUserRequestedConnectionRef.current = false
      console.error(error)
    })
  }, [autoConnect, chainID, connectAsync, connectors, isConnected, isConnecting, toExecutionChainId])

  const onDesactivate = useCallback((): void => {
    analytics(YEARN_WALLET_EVENTS.DISCONNECT_WALLET, {
      props: { chainID: String(chainID) }
    })
    disconnect()
  }, [disconnect, analytics, chainID])

  const openLoginModal = useCallback(async (): Promise<void> => {
    if (isConnected && connector && address) {
      if (openAccountModal) {
        openAccountModal()
      } else if (openChainModal) {
        openChainModal()
      } else {
        console.warn('Impossible to open account modal')
      }
    } else {
      const ledgerConnector = connectors.find((c) => c.id.toLowerCase().includes('ledger'))
      if (isIframe() && ledgerConnector) {
        hasUserRequestedConnectionRef.current = true
        await connectAsync({
          connector: ledgerConnector,
          chainId: toExecutionChainId(chainID) ?? chainID
        })
        return
      }

      if (openConnectModal) {
        hasUserRequestedConnectionRef.current = true
        openConnectModal()
      } else if (openChainModal) {
        openChainModal()
      } else {
        console.warn('Impossible to open login modal')
      }
    }
  }, [
    address,
    connectAsync,
    connector,
    connectors,
    chainID,
    isConnected,
    openAccountModal,
    openChainModal,
    openConnectModal,
    toExecutionChainId
  ])

  // Effect: resolves the Clusters name off the main thread once an address is
  // known. Deferred to idle time because it is decorative, and cancelled on
  // address change — neither is expressible as derived state.
  useEffect(() => {
    if (!isConnected || !isAddress(address)) {
      setClusters(undefined)
      setIsFetchingClusters(false)
      return undefined
    }

    if (ensName) {
      setClusters(undefined)
      setIsFetchingClusters(false)
      return undefined
    }

    const state: { isCancelled: boolean; timeoutId?: number; idleId?: number } = { isCancelled: false }
    const supportsIdleCallback =
      typeof window !== 'undefined' && 'requestIdleCallback' in window && 'cancelIdleCallback' in window

    const run = async (): Promise<void> => {
      setIsFetchingClusters(true)
      try {
        const clustersTag = await fetchClusterName(address)
        if (state.isCancelled) {
          return
        }

        if (clustersTag) {
          const [clustersName] = clustersTag.split('/')
          const profileImage = getClusterImageUrl(clustersName)
          setClusters({ name: `${clustersTag}`, avatar: profileImage })
          return
        }

        setClusters(undefined)
      } catch (error) {
        console.error(error)
        if (!state.isCancelled) {
          setClusters(undefined)
        }
      } finally {
        if (!state.isCancelled) {
          setIsFetchingClusters(false)
        }
      }
    }

    if (supportsIdleCallback) {
      const idleWindow = window as Window & {
        requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
        cancelIdleCallback: (handle: number) => void
      }
      state.idleId = idleWindow.requestIdleCallback(
        () => {
          void run()
        },
        { timeout: 2000 }
      )
    } else {
      state.timeoutId = window.setTimeout(() => {
        void run()
      }, 400)
    }

    return () => {
      state.isCancelled = true
      if (state.timeoutId !== undefined) {
        window.clearTimeout(state.timeoutId)
      }
      if (state.idleId !== undefined && supportsIdleCallback) {
        const idleWindow = window as Window & {
          cancelIdleCallback: (handle: number) => void
        }
        idleWindow.cancelIdleCallback(state.idleId)
      }
    }
  }, [address, ensName, isConnected])

  const isUserConnecting = isConnecting && hasUserRequestedConnectionRef.current

  const isIdentityLoading = Boolean((isEnsLoading && !!address) || isFetchingClusters)
  const isWalletSafe = isSafeConnectorId(connector?.id)
  const isWalletLedger = connector?.id.toLowerCase().includes('ledger') ?? false

  const contextValue = useMemo(
    () => ({
      address: isConnected && address ? toAddress(address) : undefined,
      ens: isConnected && ensName ? ensName : undefined,
      clusters: isConnected ? clusters : undefined,
      chainID,
      isActive: isConnected,
      isWalletSafe,
      isWalletLedger,
      isUserConnecting,
      isIdentityLoading,
      openLoginModal,
      onDesactivate
    }),
    [
      address,
      ensName,
      clusters,
      chainID,
      isConnected,
      isWalletSafe,
      isWalletLedger,
      isUserConnecting,
      isIdentityLoading,
      openLoginModal,
      onDesactivate
    ]
  )

  return <YearnWalletContext.Provider value={contextValue}>{children}</YearnWalletContext.Provider>
}

export const useYearnWallet = (): TYearnWalletContext => useContext(YearnWalletContext)
