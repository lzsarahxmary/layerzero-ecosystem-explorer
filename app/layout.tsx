import type { Metadata } from 'next'
import { ClientProviders } from '@/components/providers/ClientProviders'
import './globals.css'

export const metadata: Metadata = {
  title: 'LayerZero Ecosystem Explorer',
  description: 'Interactive cross-chain bubble map dashboard for the LayerZero ecosystem',
  icons: { icon: '/lz-emblem.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Roboto+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="grid-bg" />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
