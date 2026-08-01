import { useClaimMerkleRewards } from '@yearn/deposit/hooks/rewards/useClaimMerkleRewards'
import { buildMerkleRewardKey } from '@yearn/deposit/hooks/rewards/useMerkleRewards'
import { useChainId } from '@yearn/deposit/hooks/useAppWagmi'
import { RewardRow } from '@yearn/deposit/widget/rewards/RewardRow'
import type { TGroupedMerkleReward } from '@yearn/deposit/widget/rewards/types'
import type { TransactionStep } from '@yearn/deposit/widget/shared/TransactionOverlay'
import { toNormalizedValue } from '@yearn/util/utils/format'
import type { ReactElement } from 'react'
import { useCallback, useMemo } from 'react'
import { useWriteContract } from 'wagmi'

type TMerkleRewardRowProps = {
  groupedReward: TGroupedMerkleReward
  userAddress: `0x${string}`
  chainId: number
  onStartClaim: (step: TransactionStep, merkleRewardKeys?: string[]) => void
  isFirst?: boolean
  isAllChainsView?: boolean
  onSwitchChain?: () => void
  claimButtonClassName?: string
}

export function MerkleRewardRow(props: TMerkleRewardRowProps): ReactElement {
  const {
    groupedReward,
    userAddress,
    chainId,
    onStartClaim,
    isFirst,
    isAllChainsView,
    onSwitchChain,
    claimButtonClassName
  } = props

  const currentChainId = useChainId()
  const { isPending } = useWriteContract()

  const { prepare } = useClaimMerkleRewards({
    groupedReward,
    userAddress,
    chainId
  })

  const normalizedAmount = toNormalizedValue(groupedReward.totalUnclaimed, groupedReward.token.decimals)
  const formattedAmount = normalizedAmount.toFixed(4)

  const step = useMemo((): TransactionStep | undefined => {
    if (!prepare.isSuccess || !prepare.data?.request) {
      return undefined
    }
    return {
      prepare,
      label: 'Claim',
      confirmMessage: `Claim ${formattedAmount} ${groupedReward.token.symbol}`,
      successTitle: 'Rewards Claimed',
      successMessage: `You claimed ${formattedAmount} ${groupedReward.token.symbol}`,
      showConfetti: true
    }
  }, [prepare, formattedAmount, groupedReward.token.symbol])

  const handleClaim = useCallback(() => {
    if (!step) return
    onStartClaim(
      step,
      groupedReward.rewards.map((reward) => buildMerkleRewardKey(reward.root, reward.token.address))
    )
  }, [step, onStartClaim, groupedReward.rewards])

  return (
    <RewardRow
      chainId={chainId}
      currentChainId={currentChainId}
      tokenAddress={groupedReward.token.address}
      symbol={groupedReward.token.symbol}
      amount={normalizedAmount.toString()}
      usdValue={groupedReward.totalUsdValue}
      onClaim={handleClaim}
      isClaimPending={isPending}
      isClaimReady={prepare.isSuccess}
      isFirst={isFirst}
      isAllChainsView={isAllChainsView}
      onSwitchChain={onSwitchChain}
      claimButtonClassName={claimButtonClassName}
    />
  )
}
