import type { TAddress, TAddressLike, TAddressSmol } from '@yearn/components/types/address'
import { getAddress, zeroAddress } from 'viem'

/******************************************************************************
 * isTAddress - Checks if a string is a valid TAddress type.
 *****************************************************************************/
export function isTAddress(address?: string | null): address is TAddress {
  const regex = /^0x([0-9a-f][0-9a-f])*$/i
  return !!address && regex.test(address)
}

/******************************************************************************
 * isZeroAddress - Checks if the address is the zero address.
 *****************************************************************************/
export function isZeroAddress(address?: string): boolean {
  return toAddress(address) === toAddress(zeroAddress)
}

/******************************************************************************
 * isAddress - Checks if a string is a valid Ethereum address.
 *****************************************************************************/
export function isAddress(address?: string | null): address is TAddress {
  const regex = /^0x([0-9a-f][0-9a-f])*$/i
  return !!address && regex.test(address) && !isZeroAddress(address)
}

/******************************************************************************
 ** checksumAddress - Used to convert something looking like an address to
 ** a valid address. It will return the zero address if the address is not
 ** valid.
 *****************************************************************************/
function toChecksumAddress(address?: string | null | undefined): TAddressSmol {
  try {
    if (address && address !== 'GENESIS') {
      const checksummedAddress = getAddress(address)
      if (isTAddress(checksummedAddress)) {
        return checksummedAddress as TAddressSmol
      }
    }
  } catch {
    // console.error(error);
  }
  return zeroAddress as TAddressSmol
}

/******************************************************************************
 ** toAddress - Wagmi only requires a 0xString as a valid address. To use our
 ** safest version, we need to convert it between types, and the other way
 ** around.
 *****************************************************************************/
export function toAddress(address?: TAddressLike | null): TAddress {
  if (!address) {
    return zeroAddress
  }
  const trimmedAddress = address.trim()
  return getAddress(toChecksumAddress(trimmedAddress)?.valueOf())
}

/******************************************************************************
 ** truncateHex is used to trucate a full hex string to a specific size with
 ** a ... in the middle. Ex: 0x1234567890abcdef1234567890abcdef12345678
 ** will be truncated to 0x1234...5678
 *****************************************************************************/
export function truncateHex(address: string | undefined, size: number): string {
  if (isZeroAddress(address)) {
    if (size === 0) {
      return zeroAddress
    }
    return `0x${zeroAddress.slice(2, size)}...${zeroAddress.slice(-size)}`
  }

  if (address !== undefined) {
    if (size === 0) {
      return address
    }
    if (address.length <= size * 2 + 4) {
      return address
    }
    return `0x${address.slice(2, size + 2)}...${address.slice(-size)}`
  }
  if (size === 0) {
    return zeroAddress
  }
  return `0x${zeroAddress.slice(2, size)}...${zeroAddress.slice(-size)}`
}

/******************************************************************************
 * safeAddress - Returns a string that is safe to display as an address.
 *****************************************************************************/
export function toSafeAddress(props: {
  address?: TAddress
  ens?: string
  placeholder?: string
  addrOverride?: string
}): string {
  if (props.ens) {
    return props.ens
  }
  if (!isZeroAddress(props.address) && props.addrOverride) {
    return props.addrOverride
  }
  if (!isZeroAddress(props.address)) {
    return truncateHex(props.address, 5)
  }
  if (!props.address) {
    return props.placeholder || ''
  }
  return toAddress(props.address)
}

/******************************************************************************
 ** getColorFromAdddress - Used to generate a color from an address. This color
 ** is used as background color for the avatar.
 *****************************************************************************/
export function getColorFromAdddress({ address }: { address: TAddress }): string {
  if (!address) {
    return '#000000'
  }
  const hash = Array.from(address).reduce((h, char) => char.charCodeAt(0) + ((h << 5) - h), 0)
  const color =
    '#' +
    Array.from({ length: 3 }, (_, i) => {
      const value = (hash >> (i * 8)) & 0xff
      return value.toString(16).padStart(2, '0')
    }).join('')
  return color
}
