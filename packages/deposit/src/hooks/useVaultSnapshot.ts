import { useFetch } from '@yearn/components/hooks/useFetch'
import { PUBLIC_VAULT_DATA_CACHE_TIME } from '@yearn/deposit/data/publicQueryCache'
import { buildVaultSnapshotEndpoint } from '@yearn/deposit/data/publicQueryEndpoints'
import type { TKongVaultSnapshot } from '@yearn/vaults/schemas/kongVaultSnapshotSchema'
import { kongVaultSnapshotSchema } from '@yearn/vaults/schemas/kongVaultSnapshotSchema'
import { useMemo } from 'react'

type UseVaultSnapshotProps = {
  chainId?: number
  address?: string
}

export function useVaultSnapshot({ chainId, address }: UseVaultSnapshotProps) {
  const endpoint = useMemo(() => {
    return buildVaultSnapshotEndpoint(chainId, address)
  }, [chainId, address])

  const result = useFetch<TKongVaultSnapshot>({
    endpoint,
    schema: kongVaultSnapshotSchema,
    config: {
      cacheDuration: PUBLIC_VAULT_DATA_CACHE_TIME,
      keepPreviousData: false
    }
  })

  return result
}
