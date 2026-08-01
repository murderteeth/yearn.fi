import type { NextConfig } from 'next'

/**
 * The demo site for `@yearn/deposit`. It doubles as the development workspace
 * for the widget: it mounts the same server routes the widget calls in
 * production, so the flow can be exercised end to end without running yearn.fi.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@yearn/components', '@yearn/deposit']
}

export default nextConfig
