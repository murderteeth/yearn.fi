import type { NextConfig } from 'next'

/**
 * The demo site for `@yearn/components`. It consumes the package's own source
 * through the package name, so it transpiles itself the same way a consuming
 * app does — which keeps the demo honest about how the library really resolves.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@yearn/components']
}

export default nextConfig
