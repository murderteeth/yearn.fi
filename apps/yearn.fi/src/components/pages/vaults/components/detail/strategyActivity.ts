import { toBigInt } from '@yearn/util/utils/format'
import type { TKongVaultStrategy } from '@yearn/vaults/domain/kongVaultSelectors'

export function isActiveStrategy(strategy: TKongVaultStrategy): boolean {
  return (
    strategy.status === 'active' &&
    toBigInt(strategy.details?.totalDebt || 0) > 0n &&
    (strategy.details?.debtRatio || 0) > 0
  )
}
