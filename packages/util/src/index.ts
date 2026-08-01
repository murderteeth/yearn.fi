/**
 * Public entry point for `@yearn/util`.
 *
 * Framework-free helpers, usable from anywhere: a React component, a route
 * handler, a script. The constraint that keeps this package from becoming a
 * junk drawer is a hard dependency rule — no React, no wagmi, no RainbowKit,
 * no Next. `viem` is allowed, because addresses and ABIs are the domain, not
 * a framework.
 *
 * The package is consumed as TypeScript source: apps list it in
 * `transpilePackages` rather than importing a build artifact.
 */

export type { TAddress, TAddressLike, TAddressSmol, TAddressWagmi } from '@yearn/util/types/address'
export { ADDRESS_REGEX } from '@yearn/util/types/address'
export {
  getColorFromAdddress,
  isAddress,
  isTAddress,
  isZeroAddress,
  toAddress,
  toSafeAddress,
  truncateHex
} from '@yearn/util/utils/address'
export { cl } from '@yearn/util/utils/cl'
export { fetchClusterName, getClusterImageUrl } from '@yearn/util/utils/clusters'
export { isIframe } from '@yearn/util/utils/isIframe'
export { isSafeConnectorId } from '@yearn/util/utils/walletConnectors'
