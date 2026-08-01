/**
 * Yearn protocol addresses now live in `@yearn/vaults`, and the chain-generic
 * constants in `@yearn/util`. Re-exported here so the existing
 * `@shared/utils/constants` import path keeps working.
 */

export * from '@yearn/vaults/constants/protocol'
