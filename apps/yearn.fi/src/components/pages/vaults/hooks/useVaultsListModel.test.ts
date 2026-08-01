import { getProductPinnedSections } from '@pages/vaults/hooks/useVaultsListModel.helpers'
import type { TKongVaultInput } from '@yearn/vaults/domain/kongVaultSelectors'
import { YVUSD_UNLOCKED_ADDRESS } from '@yearn/vaults/utils/yvUsd'
import { describe, expect, it } from 'vitest'

const YVUSD_VAULT = {
  version: '3.0.4',
  chainID: 1,
  address: YVUSD_UNLOCKED_ADDRESS,
  name: 'yvUSD',
  symbol: 'yvUSD',
  category: 'Stablecoin'
} as unknown as TKongVaultInput

describe('getProductPinnedSections', () => {
  it('pins yvUSD when it matches the active filters and sorting is off', () => {
    expect(
      getProductPinnedSections({
        shouldShowYvUsd: true,
        sortBy: 'none',
        yvUsdVault: YVUSD_VAULT
      })
    ).toEqual([{ key: 'yvUSD', vaults: [YVUSD_VAULT] }])
  })

  it.each(['estAPY', 'tvl', 'deposited'] as const)('does not pin yvUSD while sorting by %s', (sortBy) => {
    expect(
      getProductPinnedSections({
        shouldShowYvUsd: true,
        sortBy,
        yvUsdVault: YVUSD_VAULT
      })
    ).toEqual([])
  })
})
