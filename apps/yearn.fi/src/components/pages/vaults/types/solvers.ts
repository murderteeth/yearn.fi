import type { TTxStatus } from '@shared/utils/wagmi/transaction'
import type { TSolver } from '@yearn/components/schemas/yDaemonTokenListBalances'
import { Solver } from '@yearn/components/schemas/yDaemonTokenListBalances'
import type { TDropdownOption } from '@yearn/components/types/dropdown'
import type { TAddress } from '@yearn/util/types/address'
import type { TNormalizedBN } from '@yearn/util/types/mixed'
import type { Dispatch, SetStateAction } from 'react'
import type { Hash, TransactionReceipt } from 'viem'

export { Solver, type TSolver }

/* 🔵 - Yearn Finance ******************************************************
 **	Generic type of the WithSolver interface.
 **	All solvers should implement this interface.
 ***************************************************************************/
export type TWithSolver = {
  currentSolver: TSolver
  effectiveSolver: TSolver
  expectedOut: TNormalizedBN | undefined
  hash?: string
  isLoadingExpectedOut: boolean
  onRetrieveAllowance: (shouldForceRefetch?: boolean) => Promise<TNormalizedBN>
  onRetrieveRouterAllowance?: (shouldForceRefetch?: boolean) => Promise<TNormalizedBN>
  onApprove: (
    amount: bigint,
    txStatusSetter: Dispatch<SetStateAction<TTxStatus>>,
    onSuccess: (receipt?: TransactionReceipt) => Promise<void>,
    txHashSetter: (txHash: Hash) => void,
    onError?: (error: Error) => Promise<void>
  ) => Promise<void>
  onExecuteDeposit: (
    txStatusSetter: Dispatch<SetStateAction<TTxStatus>>,
    onSuccess: (receipt?: TransactionReceipt) => Promise<void>,
    txHashSetter: (txHash: Hash) => void,
    onError?: (error: Error) => Promise<void>
  ) => Promise<void>
  onExecuteWithdraw: (
    txStatusSetter: Dispatch<SetStateAction<TTxStatus>>,
    onSuccess: (receipt?: TransactionReceipt) => Promise<void>,
    txHashSetter: (txHash: Hash) => void,
    onError?: (error: Error) => Promise<void>
  ) => Promise<void>
}

export type TInitSolverArgs = {
  chainID: number
  version: string
  from: TAddress
  inputToken: TDropdownOption
  outputToken: TDropdownOption
  inputAmount: bigint
  isDepositing: boolean
  migrator?: TAddress
  stakingPoolAddress?: TAddress //Address of the staking pool, for veYFI zap in
  asset?: `0x${string}`
}

export type TSolverContext = {
  type: TSolver
  quote: TNormalizedBN | undefined
  init: (args: TInitSolverArgs, shouldLogError?: boolean) => Promise<TNormalizedBN | undefined>
  onRetrieveAllowance: (shouldForceRefetch?: boolean) => Promise<TNormalizedBN>
  onRetrieveRouterAllowance?: (shouldForceRefetch?: boolean) => Promise<TNormalizedBN>
  onApprove: (
    amount: bigint,
    txStatusSetter: Dispatch<SetStateAction<TTxStatus>>,
    onSuccess: (receipt?: TransactionReceipt) => Promise<void>,
    txHashSetter: (txHash: Hash) => void,
    onError?: (error: Error) => Promise<void>
  ) => Promise<void>
  onExecuteDeposit: (
    txStatusSetter: Dispatch<SetStateAction<TTxStatus>>,
    onSuccess: (receipt?: TransactionReceipt) => Promise<void>,
    txHashSetter: (txHash: Hash) => void,
    onError?: (error: Error) => Promise<void>
  ) => Promise<void>
  onExecuteWithdraw: (
    txStatusSetter: Dispatch<SetStateAction<TTxStatus>>,
    onSuccess: (receipt?: TransactionReceipt) => Promise<void>,
    txHashSetter: (txHash: Hash) => void,
    onError?: (error: Error) => Promise<void>
  ) => Promise<void>
}

/* 🔵 - Yearn Finance ******************************************************
 **	Theses types are used to define the request and response of the Vanilla,
 **	PartnerContract and ChainCoin quote hook.
 **	TVanillaRequest is the requirement to execute a quote request.
 ***************************************************************************/
export type TVanillaLikeRequest = {
  inputToken: TDropdownOption
  outputToken: TDropdownOption
  inputAmount: TNormalizedBN
  isDepositing: boolean
}
export type TVanillaLikeResult = {
  result: TNormalizedBN
  isLoading: boolean
  error: Error | undefined
}
