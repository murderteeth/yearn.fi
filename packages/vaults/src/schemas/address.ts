import { ADDRESS_REGEX, type TAddress } from '@yearn/util'
import * as z from 'zod'

/**
 * Zod validator for a checksummed address. Lives here rather than in
 * `@yearn/util` because zod is a schema concern, and the address types the
 * package validates against are already framework-free.
 */
export const addressSchema = z.custom<TAddress>((val): boolean => {
  return ADDRESS_REGEX.test(val as TAddress)
})
