import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Belleville — Intranet Commercial',
  description: 'Suivi commercial, factures, devis et commandes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.className} antialiased`} style={{ backgroundColor: '#F0F2F7' }}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
