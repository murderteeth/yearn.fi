'use client'

import { IconSpinner } from '@yearn/components/icons/IconSpinner'
import { IconWallet } from '@yearn/components/icons/IconWallet'
import { truncateHex } from '@yearn/components/utils/address'
import { cl } from '@yearn/components/utils/cl'
import { useYearnWallet } from '@yearn/components/wallet/YearnWalletProvider'
import type { ReactElement } from 'react'
import { useMemo } from 'react'

export type TConnectButtonNotificationStatus = 'pending' | 'submitted' | 'success' | 'error' | null

export type TConnectButtonProps = {
  /**
   * Called instead of the connect modal when a wallet is already attached, so
   * the host app decides what a connected click opens — an account panel, a
   * drawer, a route.
   */
  onAccountClick?: () => void
  /** Renders a status dot over the button. */
  notificationStatus?: TConnectButtonNotificationStatus
  /**
   * Shows the spinner and suppresses clicks while the host app is still
   * resolving data that belongs to the connected account.
   */
  isBusy?: boolean
}

/**
 * The Yearn wallet connection button. Requires a `YearnWalletProvider` above
 * it, which in turn requires wagmi and RainbowKit providers.
 */
export function ConnectButton({
  onAccountClick,
  notificationStatus = null,
  isBusy = false
}: TConnectButtonProps): ReactElement {
  const { isActive, isUserConnecting, isIdentityLoading, address, ens, clusters, openLoginModal } = useYearnWallet()

  const walletIdentity = useMemo((): string | undefined => {
    if (isUserConnecting) return 'Connecting...'
    if (ens) return ens
    if (clusters) return clusters.name
    if (address) return truncateHex(address, 4)
    return undefined
  }, [ens, clusters, address, isUserConnecting])

  const shouldShowSpinner = address && walletIdentity && !isUserConnecting && (isIdentityLoading || isBusy)

  const notificationDotColor = useMemo((): string => {
    switch (notificationStatus) {
      case 'error':
        return 'bg-red'
      case 'success':
        return 'bg-[#0C9000]'
      case 'pending':
      case 'submitted':
        return 'bg-primary animate-pulse'
      default:
        return ''
    }
  }, [notificationStatus])

  function handleClick(): void {
    if (shouldShowSpinner || isUserConnecting) return
    if (isActive || address || ens || clusters) {
      onAccountClick?.()
      return
    }
    openLoginModal()
  }

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleClick}
      className={cl('relative', shouldShowSpinner ? 'cursor-wait' : 'cursor-pointer')}
    >
      {walletIdentity && notificationStatus && (
        <div className={cl('absolute -right-0.5 -top-0.5 size-2 rounded-full', notificationDotColor)} />
      )}
      <p
        suppressHydrationWarning
        className={'text-xs font-normal text-text-secondary transition-colors hover:text-text-primary md:text-sm'}
      >
        {walletIdentity ? (
          <span className={'inline-flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-1.5'}>
            <IconWallet className={'size-4 text-text-secondary'} />
            <span>{walletIdentity}</span>
            {shouldShowSpinner && <IconSpinner className={'size-3.5 text-text-tertiary'} />}
          </span>
        ) : (
          <span>
            <IconWallet className={'mt-0.5 block size-4 text-text-secondary md:hidden'} />
            <span
              className={
                'relative hidden h-8 cursor-pointer items-center gap-2 justify-center rounded-lg border border-transparent bg-text-primary px-3 text-xs font-normal text-surface transition-all hover:opacity-90 md:flex'
              }
            >
              <IconWallet className={'size-4 text-surface'} />
              <span>{'Connect wallet'}</span>
            </span>
          </span>
        )}
      </p>
    </div>
  )
}
