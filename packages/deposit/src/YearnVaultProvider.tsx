'use client'

import { AppSettingsContextApp } from '@yearn/deposit/contexts/useAppSettings'
import { EnsoStatusProvider } from '@yearn/deposit/contexts/useEnsoStatus'
import { IndexedDB } from '@yearn/deposit/contexts/useIndexedDB'
import { WithNotifications } from '@yearn/deposit/contexts/useNotifications'
import { WithNotificationsActions } from '@yearn/deposit/contexts/useNotificationsActions'
import { WalletContextApp } from '@yearn/deposit/contexts/useWallet'
import { YearnContextApp } from '@yearn/deposit/contexts/useYearn'
import { WithTokenList } from '@yearn/deposit/contexts/WithTokenList'
import type { ReactElement } from 'react'

const DEFAULT_TOKEN_LISTS = [
  'https://cdn.jsdelivr.net/gh/yearn/tokenLists@main/lists/yearn.json',
  'https://cdn.jsdelivr.net/gh/yearn/tokenLists@main/lists/popular.json'
]

export type TYearnVaultProviderProps = {
  children: ReactElement
  /** Token lists to offer in the selector. Defaults to Yearn's published lists. */
  tokenLists?: string[]
  /** Skip loading token lists — useful on routes that never open the selector. */
  shouldLoadTokenLists?: boolean
}

/**
 * Everything `<Yearn.Deposit />` needs above it: vault data, wallet balances,
 * the token list, notification queue, and widget settings.
 *
 * Expects wagmi, TanStack Query, RainbowKit and `YearnWalletProvider` from
 * `@yearn/components` further up, and `configureYearnDeposit` to have been
 * called. A host that already mounts some of these — yearn.fi mounts the whole
 * chain itself — can use the individual providers instead.
 */
export function YearnVaultProvider({
  children,
  tokenLists = DEFAULT_TOKEN_LISTS,
  shouldLoadTokenLists = true
}: TYearnVaultProviderProps): ReactElement {
  return (
    <WithTokenList lists={tokenLists} enabled={shouldLoadTokenLists}>
      <AppSettingsContextApp>
        <EnsoStatusProvider>
          <YearnContextApp>
            <WalletContextApp>
              <IndexedDB>
                <WithNotifications>
                  <WithNotificationsActions>{children}</WithNotificationsActions>
                </WithNotifications>
              </IndexedDB>
            </WalletContextApp>
          </YearnContextApp>
        </EnsoStatusProvider>
      </AppSettingsContextApp>
    </WithTokenList>
  )
}
