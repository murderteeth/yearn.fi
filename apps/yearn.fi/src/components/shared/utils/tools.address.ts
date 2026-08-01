import { toAddress, truncateHex } from '@yearn/components'
import { env } from '@/env'
import type { TDict } from '../types'

/**
 * The address primitives now live in `@yearn/components` so the shared widget
 * and this app checksum and truncate identically. They are re-exported here to
 * keep the existing `@shared/utils/tools.address` import path working.
 */
export {
  getColorFromAdddress,
  toAddress,
  toSafeAddress,
  truncateHex
} from '@yearn/components'

/***************************************************************************
 ** toENS is used to find the ENS name of an address. It will return the
 ** address if no ENS name is found.
 **
 ** Stays in the app: it reads the app's own known-ENS environment config.
 **************************************************************************/
export function toENS(address: string | null | undefined, format?: boolean, size?: number): string {
  if (!address) {
    return address || ''
  }
  const _address = toAddress(address)
  const knownENS = env.NEXT_PUBLIC_KNOWN_ENS as unknown as TDict<string>
  if (knownENS?.[_address]) {
    return knownENS[_address]
  }
  if (format) {
    return truncateHex(_address, size || 4)
  }
  return address
}
