import { cl } from '@yearn/util'

/**
 * Placeholder landing page. Replaced by the live widget demo once the deposit
 * and withdraw flows land. It imports from `@yearn/util` to prove the
 * package-to-package dependency resolves through the workspace.
 */
export default function DemoPage() {
  return (
    <main className={cl('mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6')}>
      <h1 className={'text-3xl font-bold'}>{'@yearn/deposit'}</h1>
      <p className={'text-neutral-600'}>
        {'Yearn vault deposit and withdraw widget, its transaction flows, and the server routes they depend on.'}
      </p>
      <p className={'text-neutral-600'}>{'The live widget demo lands with the deposit flow.'}</p>
    </main>
  )
}
