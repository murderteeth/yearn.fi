import { ENSO_BALANCES_CACHE_CONTROL } from '@yearn/deposit/server/enso/cache'
import { describe, expect, it } from 'vitest'

describe('ENSO_BALANCES_CACHE_CONTROL', () => {
  it('disables intermediary and browser caching for wallet balance responses', () => {
    expect(ENSO_BALANCES_CACHE_CONTROL).toBe('private, no-store, max-age=0, must-revalidate')
  })
})
