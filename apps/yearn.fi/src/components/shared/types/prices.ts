import { addressSchema } from '@yearn/vaults/schemas/address'
import * as z from 'zod'

export const priceSchema = z.string()
export const pricesSchema = z.record(addressSchema, priceSchema)
export const pricesChainSchema = z.record(z.string(), pricesSchema)

export type TPrice = z.infer<typeof priceSchema>
export type TPrices = z.infer<typeof pricesSchema>
export type TPricesChain = z.infer<typeof pricesChainSchema>
