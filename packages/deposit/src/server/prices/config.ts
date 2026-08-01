const YEARN_PRICES_BASE_URL = 'https://prices.yearn.dev'

/**
 * Resolved from the environment at call time, matching the fallback order the
 * app's holdings config used before this route moved into the package.
 */
export const pricesConfig = {
  get yearnPricesBaseUrl(): string {
    return (process.env.YEARN_PRICES_BASE_URL ?? process.env.YEARN_PRICES_API_URL ?? YEARN_PRICES_BASE_URL)
      .trim()
      .replace(/\/$/, '')
  },
  get yearnPricesApiKey(): string {
    return (process.env.YEARN_PRICES_API_KEY ?? process.env.API_KEY_PORTFOLIO ?? '').trim()
  }
}
