import { toAddress } from '@yearn/util/utils/address'
import { getVaultChainID, getVaultToken, type TKongVaultInput } from '@yearn/vaults/domain/kongVaultSelectors'
import { isYvBtcVault } from '@yearn/vaults/utils/yvBtc'
import { isYvUsdVault } from '@yearn/vaults/utils/yvUsd'
import { env } from '@/env'

function getBaseUrl(): string {
  return env.BASE_URL || '/'
}

function getAssetsBaseUrl(): string {
  return env.NEXT_PUBLIC_BASE_YEARN_ASSETS_URI || ''
}

export function getVaultPrimaryLogoSrc(vault: TKongVaultInput): string {
  if (isYvUsdVault(vault)) {
    return `${getBaseUrl()}yvusd-128.png`
  }

  if (isYvBtcVault(vault)) {
    return `${getBaseUrl()}yvBTC-1.svg`
  }

  const chainID = getVaultChainID(vault)
  const token = getVaultToken(vault)
  return `${getAssetsBaseUrl()}/tokens/${chainID}/${toAddress(token.address).toLowerCase()}/logo-128.png`
}
