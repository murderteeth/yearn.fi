import { useEnsoStatus } from '@yearn/deposit/contexts/useEnsoStatus'
import { isVaultEnsoDisabled } from '@yearn/vaults/constants/ensoDisabledVaults'
import type { Address } from 'viem'

interface UseEnsoEnabledOptions {
  chainId?: number
  vaultAddress?: Address
}

export function useEnsoEnabled({ chainId, vaultAddress }: UseEnsoEnabledOptions = {}): boolean {
  const { isEnsoFailed } = useEnsoStatus()
  const envDisabled = process.env.NEXT_PUBLIC_ENSO_DISABLED === 'true'

  if (envDisabled || isEnsoFailed) {
    return false
  }

  if (isVaultEnsoDisabled(chainId, vaultAddress)) {
    return false
  }

  return true
}
