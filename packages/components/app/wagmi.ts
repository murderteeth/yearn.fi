import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains'

/**
 * A deliberately small wagmi config for the demo. The package itself ships no
 * wagmi config — a host app brings its own — so this doubles as the reference
 * for the minimum a consumer has to provide.
 *
 * Without a WalletConnect project id, injected browser wallets still connect;
 * only the QR flow is unavailable.
 */
export const demoWagmiConfig = getDefaultConfig({
  appName: 'Yearn Components',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'yearn-components-demo',
  chains: [mainnet, optimism, polygon, base, arbitrum],
  ssr: true
})
