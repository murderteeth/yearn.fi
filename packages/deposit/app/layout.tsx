import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './demo.css'

export const metadata: Metadata = {
  title: 'Yearn Deposit',
  description: 'Demo and development workspace for the shared Yearn deposit widget.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={'en'}>
      <body>{children}</body>
    </html>
  )
}
