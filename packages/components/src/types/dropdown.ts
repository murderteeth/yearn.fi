import type { TSolver } from '@yearn/components/schemas/yDaemonTokenListBalances'
import type { TAddress } from '@yearn/util/types/address'
import type { ReactElement } from 'react'

export type TDropdownOption = {
  label: string
  symbol: string
  decimals: number
  chainID: number
  value: TAddress
  icon?: ReactElement
  zapVia?: TAddress
  solveVia?: TSolver[]
  settings?: {
    shouldNotBeWithdrawTarget?: boolean
    shouldHideIfZero?: boolean
  }
}

export type TDropdownProps = {
  options: TDropdownOption[]
  defaultOption: TDropdownOption
  selected?: TDropdownOption
  placeholder?: string
  className?: string
  comboboxOptionsClassName?: string
  onSelect: React.Dispatch<React.SetStateAction<TDropdownOption>> | ((option: TDropdownOption) => void)
}

export type TDropdownItemProps = {
  option: TDropdownOption
}
