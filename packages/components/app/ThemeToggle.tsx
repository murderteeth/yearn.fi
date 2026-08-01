'use client'

import { cl } from '@yearn/util'
import type { ReactElement } from 'react'
import { useState } from 'react'

const THEMES = ['light', 'dark', 'soft-dark', 'midnight'] as const

type TTheme = (typeof THEMES)[number]

/**
 * The design tokens switch on `data-theme` on the root element. This proves
 * the package's themes work standalone, without yearn.fi's theme context.
 */
export function ThemeToggle(): ReactElement {
  const [theme, setTheme] = useState<TTheme>('light')

  function applyTheme(next: TTheme): void {
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <div className={'flex flex-wrap items-center gap-2'}>
      {THEMES.map((eachTheme) => (
        <button
          key={eachTheme}
          type={'button'}
          onClick={() => applyTheme(eachTheme)}
          className={cl(
            'yearn--button--nextgen h-8 px-3 text-xs',
            eachTheme === theme ? 'bg-primary text-[#f5f5f5]' : 'bg-surface-secondary text-text-primary'
          )}
        >
          {eachTheme}
        </button>
      ))}
    </div>
  )
}
