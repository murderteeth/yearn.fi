import { cl } from '@yearn/components'

/**
 * Placeholder landing page. It exists so the scaffold proves the thing that is
 * easy to get wrong in a monorepo: that a consumer can resolve the package by
 * name, run its TypeScript through its own build, and pick up its stylesheet.
 * The real connect-button demo replaces this once the wallet layer lands.
 */
export default function DemoPage() {
  return (
    <main className={cl('mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6')}>
      <h1 className={'text-3xl font-bold'}>{'@yearn/components'}</h1>
      <p className={'text-neutral-600'}>
        {'Shared Yearn UI primitives, design tokens, and the wallet connection layer.'}
      </p>
      <p className={'text-neutral-600'}>{'The connect button demo lands with the wallet layer.'}</p>
    </main>
  )
}
