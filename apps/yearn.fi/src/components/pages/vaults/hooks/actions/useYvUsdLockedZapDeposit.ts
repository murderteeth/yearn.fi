import type { UseWidgetDepositFlowReturn } from '@pages/vaults/types'
import { type AppUseSimulateContractReturnType, useReadContract, useSimulateContract } from '@shared/hooks/useAppWagmi'
import { toAddress } from '@yearn/util/utils/address'
import { yvUsdLockedZapAbi } from '@yearn/vaults/abi/yvUsdLockedZap.abi'
import { getApproveAbi } from '@yearn/vaults/utils/approve'
import { YVUSD_LOCKED_ZAP_ADDRESS } from '@yearn/vaults/utils/yvUsd'
import type { Address } from 'viem'
import { useTokenAllowance } from '../useTokenAllowance'

interface UseYvUsdLockedZapDepositParams {
  depositToken: Address
  amount: bigint
  account?: Address
  chainId: number
  enabled: boolean
}

export function useYvUsdLockedZapDeposit(params: UseYvUsdLockedZapDepositParams): UseWidgetDepositFlowReturn {
  const { allowance = 0n, refetch: refetchAllowance } = useTokenAllowance({
    account: params.account,
    token: params.depositToken,
    spender: YVUSD_LOCKED_ZAP_ADDRESS,
    watch: true,
    chainId: params.chainId
  })

  const isValidInput = params.amount > 0n
  const isAllowanceSufficient = allowance >= params.amount
  const prepareApproveEnabled = !!params.account && params.enabled && isValidInput && !isAllowanceSufficient
  const prepareDepositEnabled = !!params.account && params.enabled && isValidInput && isAllowanceSufficient

  const { data: expectedOut = 0n } = useReadContract({
    address: YVUSD_LOCKED_ZAP_ADDRESS,
    abi: yvUsdLockedZapAbi,
    functionName: 'previewZapIn',
    args: [params.amount],
    chainId: params.chainId,
    query: { enabled: params.enabled && isValidInput }
  })

  const prepareApprove: AppUseSimulateContractReturnType = useSimulateContract({
    abi: getApproveAbi(params.depositToken),
    functionName: 'approve',
    address: params.depositToken,
    args: params.amount > 0n ? [YVUSD_LOCKED_ZAP_ADDRESS, params.amount] : undefined,
    chainId: params.chainId,
    query: { enabled: prepareApproveEnabled }
  })

  const prepareDeposit: AppUseSimulateContractReturnType = useSimulateContract({
    address: YVUSD_LOCKED_ZAP_ADDRESS,
    abi: yvUsdLockedZapAbi,
    functionName: 'zapIn',
    args: params.account && params.amount > 0n ? [params.amount, toAddress(params.account)] : undefined,
    account: params.account ? toAddress(params.account) : undefined,
    chainId: params.chainId,
    query: { enabled: prepareDepositEnabled }
  })

  return {
    actions: {
      prepareApprove,
      prepareDeposit
    },
    periphery: {
      prepareApproveEnabled,
      prepareDepositEnabled,
      isAllowanceSufficient,
      allowance,
      expectedOut,
      minExpectedOut: expectedOut,
      isLoadingRoute: false,
      isCrossChain: false,
      routerAddress: YVUSD_LOCKED_ZAP_ADDRESS,
      error: undefined,
      refetchAllowance
    }
  }
}
