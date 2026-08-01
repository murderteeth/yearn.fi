import { ADDRESS_REGEX, type TAddress } from '@yearn/components'
import * as z from 'zod'

export type { TAddress, TAddressLike, TAddressSmol, TAddressWagmi } from '@yearn/components'
/**
 * The address types now live in `@yearn/components`, re-exported here to keep
 * the existing `@shared/types/address` import path working. `addressSchema`
 * stays in the app because the package does not depend on zod.
 */
export { ADDRESS_REGEX } from '@yearn/components'

export const addressSchema = z.custom<TAddress>((val): boolean => {
  return ADDRESS_REGEX.test(val as TAddress)
})
