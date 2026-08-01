import type { TAddress } from '@yearn/util/types/address'

export type TPortfolioProtocolPosition = {
  id: string
  name: string
  symbol: string
  href: string
  tokenAddress: TAddress
  decimals: number
  activeRaw: bigint
  cooldownRaw: bigint
  withdrawableRaw: bigint
  walletRaw: bigint
  valueUsd: number
  tvlUsd: number
  apy: number | null
  unlockTime?: number
  boostMultiplier?: number
  cooldown?: {
    endsAt: number
  } | null
}
