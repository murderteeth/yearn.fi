import { toAddress } from '@yearn/util/utils/address'
import { KONG_REST_BASE } from '@yearn/vaults/data/kongRest'
import { isAddress } from 'viem'

export const YEARN_TVL_ENDPOINT = 'https://api.llama.fi/tvl/yearn'
export const YEARN_VAULT_LIST_ENDPOINT = `${KONG_REST_BASE}/list/vaults`

export function buildVaultSnapshotEndpoint(chainId?: number | string, address?: string): string | null {
  const resolvedChainId = Number(chainId)
  if (!Number.isInteger(resolvedChainId) || !address || !isAddress(address)) {
    return null
  }

  return `${KONG_REST_BASE}/snapshot/${resolvedChainId}/${toAddress(address)}`
}
