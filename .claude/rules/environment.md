# Environment Setup

Each workspace owns its own env file. For the app, copy `apps/yearn.fi/.env.example` to
`apps/yearn.fi/.env` and configure:
- RPC URIs for each chain: `VITE_RPC_URI_FOR_<chainId>`
- WalletConnect project ID: `VITE_WALLETCONNECT_PROJECT_ID`
- Yearn API endpoints: `VITE_YDAEMON_BASE_URI`, `VITE_KONG_REST_URL`
- Enso API key: `ENSO_API_KEY` (server-only, no VITE_ prefix)
- Balance source strategy: `VITE_BALANCE_SOURCE` (`enso` or `multicall`)
