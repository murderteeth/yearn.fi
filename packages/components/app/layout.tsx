import type { Metadata } from 'next'
import type { ReactElement, ReactNode } from 'react'
import { DemoProviders } from './providers'
import './demo.css'

export const metadata: Metadata = {
  title: 'Yearn Components',
  description: 'Demo site for the shared Yearn component library.'
}

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang={'en'} data-theme={'light'}>
      <body>
        <DemoProviders>{children}</DemoProviders>
      </body>
    </html>
  )
}
