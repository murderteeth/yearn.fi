import { ADDRESS_REGEX, type TAddress } from '@yearn/util'
import * as z from 'zod'

export type { TAddress, TAddressLike, TAddressSmol, TAddressWagmi } from '@yearn/util'
/**
 * The address types now live in `@yearn/util`, re-exported here to keep
 * the existing `@shared/types/address` import path working. `addressSchema`
 * stays in the app because the package does not depend on zod.
 */
export { ADDRESS_REGEX } from '@yearn/util'

export const addressSchema = z.custom<TAddress>((val): boolean => {
  return ADDRESS_REGEX.test(val as TAddress)
})
