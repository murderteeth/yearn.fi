import { toAddress } from '@yearn/components'
import type { TAddress } from '../types/address'
import { ETH_TOKEN_ADDRESS } from './constants'

/**
 * The address predicates now live in `@yearn/components` alongside `toAddress`,
 * and are re-exported here to keep the existing import path working.
 */
export { isAddress, isTAddress, isZeroAddress } from '@yearn/components'

export function isZero(value?: bigint | number | string | null): boolean {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    value = value.trim().replace(',', '.')

    if (value === '') {
      return false
    }

    // Check if the string can be parsed as a floating-point number
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      return parsed === 0
    }
  }

  try {
    return BigInt(value) === 0n
  } catch {
    return false
  }
}

/******************************************************************************
 * isEthAddress - Checks if the address is the ETH address
 *****************************************************************************/
export function isEthAddress(address?: string | null | TAddress): boolean {
  return toAddress(address) === toAddress(ETH_TOKEN_ADDRESS)
}

export function isNumber(value: string | number): value is number {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false
  }
  if (typeof value === 'object') {
    return false
  }
  return !Number.isNaN(+value)
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isObject(input: unknown): input is { [key: string]: unknown } {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}
