import type { TToken } from '@yearn/util/types/mixed'
import { toAddress } from '@yearn/util/utils/address'

/**
 * Chain-generic constants. Yearn protocol addresses (yCRV, yBAL, veYFI, and the
 * zap contracts) are domain knowledge and live in `@yearn/vaults` instead.
 */

export const MULTICALL3_ADDRESS = toAddress('0xcA11bde05977b3631167028862bE2a173976CA11')
export const ZERO_ADDRESS = toAddress('0x0000000000000000000000000000000000000000')
export const ETH_TOKEN_ADDRESS = toAddress('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
export const WETH_TOKEN_ADDRESS = toAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
export const WFTM_TOKEN_ADDRESS = toAddress('0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83')
export const OPT_WETH_TOKEN_ADDRESS = toAddress('0x4200000000000000000000000000000000000006')
export const BASE_WETH_TOKEN_ADDRESS = toAddress('0x4200000000000000000000000000000000000006')
export const ARB_WETH_TOKEN_ADDRESS = toAddress('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1')

export const BIG_ZERO = 0n
export const MAX_UINT_256 = 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn

export const DEFAULT_ERC20: TToken = {
  address: ZERO_ADDRESS,
  name: '',
  symbol: '',
  decimals: 18,
  chainID: 1,
  value: 0,
  balance: { raw: 0n, normalized: 0, display: '0', decimals: 18 }
}
