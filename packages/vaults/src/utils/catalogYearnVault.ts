import type { TKongVaultListItem } from '@yearn/vaults/schemas/kongVaultListSchema'

export const isCatalogYearnVault = (item: TKongVaultListItem): boolean =>
  item.origin === 'yearn' && item.inclusion?.isYearn !== false
