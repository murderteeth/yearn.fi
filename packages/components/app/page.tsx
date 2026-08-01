'use client'

import { useYearnWallet, Yearn } from '@yearn/components'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

function Section({ title, description, children }: { title: string; description: string; children: ReactElement }) {
  return (
    <section className={'flex flex-col gap-3 rounded-lg border border-border bg-surface p-6'}>
      <div className={'flex flex-col gap-1'}>
        <h2 className={'text-lg font-bold text-text-primary'}>{title}</h2>
        <p className={'text-sm text-text-secondary'}>{description}</p>
      </div>
      {children}
    </section>
  )
}

function WalletState(): ReactElement {
  const { address, ens, clusters, chainID, isActive, isWalletSafe } = useYearnWallet()

  return (
    <dl className={'grid grid-cols-2 gap-x-6 gap-y-2 font-number text-xs text-text-secondary'}>
      {[
        ['isActive', String(isActive)],
        ['address', address ?? '—'],
        ['ens', ens ?? '—'],
        ['clusters', clusters?.name ?? '—'],
        ['chainID', String(chainID)],
        ['isWalletSafe', String(isWalletSafe)]
      ].map(([label, value]) => (
        <div key={label} className={'contents'}>
          <dt className={'text-text-tertiary'}>{label}</dt>
          <dd className={'truncate text-text-primary'}>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function DemoPage(): ReactElement {
  const [accountClicks, setAccountClicks] = useState(0)

  return (
    <main className={'mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16'}>
      <header className={'flex flex-col gap-2'}>
        <h1 className={'text-3xl font-bold text-text-primary'}>{'@yearn/components'}</h1>
        <p className={'text-text-secondary'}>
          {'Design tokens, UI primitives, and the wallet connection layer, running outside yearn.fi.'}
        </p>
      </header>

      <Section
        title={'Yearn.ConnectButton'}
        description={
          'Connects a real wallet. When one is already attached it calls onAccountClick instead, so the host app decides what opens.'
        }
      >
        <div className={'flex flex-col gap-4'}>
          <div className={'flex items-center gap-4'}>
            <Yearn.ConnectButton onAccountClick={() => setAccountClicks((count) => count + 1)} />
            <span className={'text-xs text-text-tertiary'}>{`onAccountClick fired ${accountClicks}×`}</span>
          </div>
          <WalletState />
        </div>
      </Section>

      <Section
        title={'Notification status'}
        description={'The status dot the host app drives while a tx is in flight.'}
      >
        <div className={'flex flex-wrap items-center gap-6'}>
          {(['pending', 'success', 'error'] as const).map((status) => (
            <div key={status} className={'flex items-center gap-2'}>
              <Yearn.ConnectButton notificationStatus={status} />
              <span className={'text-xs text-text-tertiary'}>{status}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={'Themes'} description={'Every token switches on data-theme, shipped by the package.'}>
        <ThemeToggle />
      </Section>
    </main>
  )
}
