import { useYearnWallet } from '@yearn/components'
import { depositConfig, type TDepositConfig } from '@yearn/deposit/config'
import { useWalletActions, useWalletTokens } from '@yearn/deposit/contexts/useWallet'
import { useYearn } from '@yearn/deposit/contexts/useYearn'
import { useEnsoEnabled } from '@yearn/deposit/hooks/useEnsoEnabled'
import { useAccount } from 'wagmi'

type TUseWidgetContextParams = {
  chainId: number
  vaultAddress: `0x${string}`
}

type TWidgetContext = {
  account: `0x${string}` | undefined
  openLoginModal: (() => void) | undefined
  refreshWalletBalances: ReturnType<typeof useWalletActions>['onRefresh']
  getToken: ReturnType<typeof useWalletTokens>['getToken']
  zapSlippage: number
  isAutoStakingEnabled: boolean
  trackEvent: TDepositConfig['analytics']
  ensoEnabled: boolean
  isWalletSafe: boolean
}

export function useWidgetContext({ chainId, vaultAddress }: TUseWidgetContextParams): TWidgetContext {
  const { address: account } = useAccount()
  const { openLoginModal, isWalletSafe } = useYearnWallet()
  const { onRefresh: refreshWalletBalances } = useWalletActions()
  const { getToken } = useWalletTokens()
  const { zapSlippage, isAutoStakingEnabled } = useYearn()
  const trackEvent = depositConfig().analytics
  const ensoEnabled = useEnsoEnabled({ chainId, vaultAddress })

  return {
    account,
    openLoginModal,
    refreshWalletBalances,
    getToken,
    zapSlippage,
    isAutoStakingEnabled,
    trackEvent,
    ensoEnabled,
    isWalletSafe
  }
}
