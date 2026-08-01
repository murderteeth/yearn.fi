import type { Metadata } from 'next'
import type { ReactElement, ReactNode } from 'react'
import { DemoProviders } from './providers'
import './demo.css'

export const metadata: Metadata = {
  title: 'Yearn Deposit',
  description: 'Demo and development workspace for the shared Yearn deposit widget.'
}

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang={'en'} data-theme={'light'}>
      <body>
        <DemoProviders>{children as ReactElement}</DemoProviders>
      </body>
    </html>
  )
}
