'use client'

import { Yearn } from '@yearn/deposit'
import { useYearn } from '@yearn/deposit/contexts/useYearn'
import { cl } from '@yearn/util'
import type { TAddress } from '@yearn/util/types/address'
import { getVaultName, getVaultToken } from '@yearn/vaults/domain/kongVaultSelectors'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

/** A few well-known mainnet vaults, so the demo opens on something real. */
const FEATURED: { address: TAddress; label: string }[] = [
  { address: '0x028eC7330ff87667b6dfb0D94b954c820195336c', label: 'yvDAI' },
  { address: '0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204', label: 'yvUSDC' },
  { address: '0xAc37729B76db6438CE62042AE1270ee574CA7571', label: 'yvWETH' }
]

const MAINNET = 1

function VaultPicker({ value, onChange }: { value: TAddress; onChange: (next: TAddress) => void }): ReactElement {
  const { vaults } = useYearn()

  const options = useMemo(
    () =>
      FEATURED.map((entry) => {
        const vault = vaults[entry.address]
        return {
          ...entry,
          name: vault ? getVaultName(vault) : entry.label,
          symbol: vault ? getVaultToken(vault)?.symbol : undefined
        }
      }),
    [vaults]
  )

  return (
    <div className={'flex flex-wrap gap-2'}>
      {options.map((option) => (
        <button
          key={option.address}
          type={'button'}
          onClick={() => onChange(option.address)}
          className={cl(
            'yearn--button--nextgen h-9 px-3 text-xs',
            option.address === value ? 'bg-primary text-[#f5f5f5]' : 'bg-surface-secondary text-text-primary'
          )}
        >
          {option.symbol ? `${option.name} (${option.symbol})` : option.name}
        </button>
      ))}
    </div>
  )
}

export default function DemoPage(): ReactElement {
  const [address, setAddress] = useState<TAddress>(FEATURED[0].address)
  const { isLoadingVaultList } = useYearn()

  return (
    <main className={'mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-6 py-12'}>
      <header className={'flex flex-col gap-2'}>
        <div className={'flex items-start justify-between gap-4'}>
          <h1 className={'text-3xl font-bold text-text-primary'}>{'@yearn/deposit'}</h1>
          <Yearn.ConnectButton />
        </div>
        <p className={'text-text-secondary'}>
          {'The deposit and withdraw widget, running outside yearn.fi against live mainnet vault data.'}
        </p>
        <code className={'font-number text-xs text-text-tertiary'}>
          {`<Yearn.Deposit chainId={1} address="${address.slice(0, 10)}…" />`}
        </code>
      </header>

      <VaultPicker value={address} onChange={setAddress} />

      {isLoadingVaultList ? (
        <p className={'text-sm text-text-tertiary'}>{'Loading vaults…'}</p>
      ) : (
        // Keyed by vault so switching remounts the widget and clears its input
        // and token selection, rather than an effect resetting them afterwards.
        <Yearn.Deposit key={address} chainId={MAINNET} address={address} />
      )}
    </main>
  )
}
