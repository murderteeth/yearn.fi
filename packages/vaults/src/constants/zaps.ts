import { toAddress } from '@yearn/util'

/**
 * Native-to-wrapped zap contracts, used when depositing a chain's native token
 * into a vault that wants the wrapped form.
 */
export const ZAP_ETH_WETH_CONTRACT = toAddress('0xd1791428c38e25d459d5b01fb25e942d4ad83a25')
export const ZAP_FTM_WFTM_CONTRACT = toAddress('0xfCE6CbeF3867102da383465cc237B49fF4B9d48F')
export const ZAP_ETH_WETH_OPT_CONTRACT = toAddress('0xDeAFc27aC8f977E6973d671E43cBfd2573021d9e')
