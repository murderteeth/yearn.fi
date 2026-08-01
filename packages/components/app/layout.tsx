import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './demo.css'

export const metadata: Metadata = {
  title: 'Yearn Components',
  description: 'Demo site for the shared Yearn component library.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={'en'}>
      <body>{children}</body>
    </html>
  )
}
